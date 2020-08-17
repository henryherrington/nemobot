const express = require("express");
var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
const port = 3000;
const path = require("path");
const fs = require("fs");
const { isArray } = require("util");

// currentGame uses socket.id's as keys and gamefiles as values to track
// which users are playing which games
let currentGame = {};

// allGames uses filenames as keys and requires the corresponding modules
// as values
let allGames = {};

// serve main page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// serves public files (including css)
app.use(express.static(__dirname + "/public"));


io.on("connection", (socket) => {

  // create a sessionId to be used in DialogFlow
  let sessionId = socket.id;
  // console.log("new socket: " + sessionId);

  socket.on("user message", (msg) => {

    if (msg.trim() === "") return;

    let msgWords = msg.split(" ");
    let command = msgWords[0];  // gameselect, gamestart, or gamestate
    let payload = msgWords[1];  // filename or gamestate payload

    // user wants to select a given game
    if (command === "gameselect") {
      
      let gameFileName = payload;

      if (gameFileName in allGames) {
        currentGame[socket.id] = allGames[gameFileName];
        
        // read introduction
        let introduction = allGames[gameFileName].introduction;
        if (isArray(introduction)) {
          for (let i = 0; i < introduction.length; i++) {
            io.to(socket.id).emit("say", introduction[i]);
          }
        }
        else io.to(socket.id).emit("say", allGames[gameFileName].introduction);

        io.to(socket.id).emit("say", "Start the game now?");
        io.to(socket.id).emit("send button", [{title: "Sure", payload: "gamestart " + gameFileName}, "No thanks"]);
      }

      else {
        io.to(socket.id).emit("say", "Game not found.");
        currentGame[socket.id] = undefined;
      }
    }

    // user wants to start a given game
    else if (command === "gamestart") {
      let gameFileName = payload;
      if (gameFileName in allGames) {
        currentGame[socket.id] = allGames[gameFileName];
        currentGame[socket.id].start(say, sendButton);
      }
      else {
        io.to(socket.id).emit("say", "Game not found.");
        currentGame[socket.id] = undefined;
      }
    }

    // user wants to pass a payload to a given game
    else if (command === "gamestate") {
      currentGame[socket.id].state(payload, say, sendButton);
    }

    // the user is just making conversation, not playing a game
    else {
      let query = [msg];

      async function runDialogFlow() {
        let dialogFlowResponse = await executeQueries(projectId, sessionId, query, languageCode);

        // display current games if requested
        if (dialogFlowResponse === "show games") {
          // refresh game inventory from server
          getGames();

          // display games as selectable buttons
          let buttonOptions = new Array();
          for (var game in allGames) {
            let buttonOption = {
              title: allGames[game].title,
              payload: "gameselect " + allGames[game].filename
            }
            buttonOptions.push(buttonOption);
          }
          io.to(socket.id).emit("say", "Choose your game:");
          io.to(socket.id).emit("send button", buttonOptions);
        }

        // otherwise, respond in normal conversation
        else io.to(socket.id).emit("say", dialogFlowResponse);
      }

      runDialogFlow();
    }

    // allow games to emit messages to the client
    async function say(input) {
      if (isArray(input)) {
        for (let i = 0; i < input.length; i++) {
          io.to(socket.id).emit("say", input[i]);
        }
      }
      else io.to(socket.id).emit("say", input);
    }
    
    // allow games to emit buttons to the client
    async function sendButton(title, buttons) {
      for (var button in buttons) {
        if (buttons[button].payload === "restart") {
          if (socket.id in currentGame)
            buttons[button].payload = "gamestart " + currentGame[socket.id].filename;
        }
        else buttons[button].payload = "gamestate " + buttons[button].payload;
      }

        io.to(socket.id).emit("say", title);
        io.to(socket.id).emit("send button", buttons);
    }
  });
});

http.listen(port, () => {
  console.log(`listening on port ${port}`);
});


// refresh allGames with games currently on server
function getGames() {
  const gamePath = path.join(__dirname, "games");

  fs.readdirSync(gamePath).forEach(file => {
    let currentGame = require(path.join(gamePath, file));
    allGames[currentGame.filename] = currentGame;
  });
}


// ------------ dialog flow ---------------

// projectId: ID of the GCP project where Dialogflow agent is deployed
const projectId = 'nemo-bot-286320';

// languageCode: Indicates the language Dialogflow agent should use to detect intents
const languageCode = 'en';

// Imports the Dialogflow library
const dialogflow = require('@google-cloud/dialogflow');

// Instantiates a session client
const sessionClient = new dialogflow.SessionsClient();

async function detectIntent(
  projectId,
  sessionId,
  query,
  contexts,
  languageCode
) {
  // The path to identify the agent that owns the created intent.
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode: languageCode,
      },
    },
  };

  if (contexts && contexts.length > 0) {
    request.queryParams = {
      contexts: contexts,
    };
  }

  const responses = await sessionClient.detectIntent(request);
  return responses[0];
}

async function executeQueries(projectId, sessionId, queries, languageCode) {
  // Keeping the context across queries let's us simulate an ongoing conversation with the bot
  let context;
  let intentResponse;
  for (const query of queries) {
    try {
      // console.log(`Sending Query: ${query}`);
      intentResponse = await detectIntent(
        projectId,
        sessionId,
        query,
        context,
        languageCode
      );
      console.log('Detected intent from: ' + sessionId);
      // console.log(
      //   `Fulfillment Text: ${intentResponse.queryResult.fulfillmentText}`
      // );
      // Use the context from this response for next queries
      context = intentResponse.queryResult.outputContexts;
      // console.log(intentResponse.queryResult.fulfillmentText);
      return intentResponse.queryResult.fulfillmentText;
    } catch (error) {
      console.log(error);
    }
  }
}
