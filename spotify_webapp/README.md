# Music Player Web Application 

There are two directories - **auth-server** and **client** -  which are both responsible for creating the front-end web application. **auth-server** is used for running the Node.js application to access Spotify user authentication while **client** is used for running the React front-end application.

## Installation

Run `npm install` for both directories to install all necessary packages declared from package.json

## Instructions

#### auth-server/authorization_code
- Run the auth-server with `node server.js` 
- Use the app locally by entering http://localhost:8888/ in the browser
- Log-in with your own Spotify account

#### client/
~~- Run the client with `npm start`~~ This is no longer the case as this application is already ejected for deployment
- It was ejected with `npm run eject`
- Build the client with `npm run build` where the configurations are set directly to the **fer_model** directory.
