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
  socket.on("user message", (msg) => {

    let msgWords = msg.split(" ");
    let command = msgWords[0];  // gameselect, gamestart, or gamestate
    let payload = msgWords[1];  // filename or gamestate payload

    // user wants to see all games on server
    if (command === "games") {
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
