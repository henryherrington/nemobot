<h1 align="center">Nemobot</h1> 
<p align="center">
  <img src="https://raw.githubusercontent.com/henryherrington/nemo-bot/master/images/app_screenshot.png" height="75%" width="75%" margin="auto">
</p>

## About
This is the first online version of the chatbot Nemobot that I created as part of a summer internship with [Nautlius Software Technologies](https://nautilustech.ai/) in the summer of 2020. Nemobot is used to teach JavaScript by running two-player JavaScript games that can be coded by students! Currently, these games are hard-coded in the games directory. In addition to running these games, Nemobot can chat conversationally with users. The goal of this project was to improve upon an earlier version of Nemobot that is available through Facebook Messenger and does not support natural language processing.

This version of Nemobot was developed with an Express server on a Node.js backend, HTML, CSS, and is integrated with Google Dialogflow to allow for natural language processing.

## Demo
A working (slightly outdated) demo is available at: http://34.92.103.169/.
This demo is hosted by Nautilus Software Technologies.

## Local Set Up
1) Clone or download the repository
2) Install dependencies with `npm install`
3) Import the Nemobot agent into your Dialogflow Essentials console using the provided nemo-bot.zip file.
4) Set up Google Cloud credentials in an environment variable to support Google Dialogflow and access to your Nemobot agent. Follow the instructions [here](https://cloud.google.com/docs/authentication/getting-started) for more details on setting up GC credentials.
5) Run the Express server with `node app.js`
6) Access the running app at http://localhost:3000/
