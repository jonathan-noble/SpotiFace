# Final Year Project: SpotiFace - A Mood-Based Music Player [![Build Status](https://travis-ci.org/jonathan-noble/SpotiFace.svg?branch=master)](https://travis-ci.org/jonathan-noble/emotion-detection-player)

## Overview
SpotiFace is a music service web application that recommends a playlist according to the user’s captured facial expression. This project is comprised of two components embodied in one system: 
  
  * The front-end, developed in ReactJS, is responsible for sending the captured image by the camera or the chosen file from the local device towards the back-end for further prediction, and a music player pulling the data via Spotify API corresponding to the highest predicted emotion. 

  * The back-end, built in Python with the microframework Flask, consists of a face detection with image processing techniques, and a machine-learning model powered by the VGG-16 network which can recognize the user's captured facial expression and post the aforementioned highest predicted emotion – ranging from six classes of emotion: happy, sad, angry, neutral, scared and surprised – back to the application.
  
The primary aim of this project is to enhance accessibility in music applications by providing an alternative approach that streamlines user convenience. It reduces the need for manual playlist browsing or searching through a feature that leverages cutting-edge Deep Learning technologies.

The computer vision fundamentals, deep learning knowledge and sample codes that have significantly aided the Facial Expression Recognition (FER) model is from a book bundle "Deep Learning For Computer Vision" by Dr. Adrian Rosebrock. Moreover, the dataset I acquired is from a [Kaggle Contest](https://www.kaggle.com/c/challenges-in-representation-learning-facial-expression-recognition-challenge/data). The aforementioned FER model is stored under the **fer_model** directory.

The state-of-the-art web application is built under the Node.js platform which uses the Express framework, React library and the well-documented [API from Spotify](https://developer.spotify.com/documentation/web-api/) to create services corresponding to the labelled mood of the FER model. This component is stored under the **spotify_webapp** directory.

## Key Features
- Spotify OAuth2.0
- Spotify API endpoints
- Facial Expression Recognition and Highest Prediction of mood
- SpotiFace Jukebox - Recommendations based on tuneable track attributes e.g. Valence, corresponding to the mood
- Mood Playlists - Recommendations based on associated keyword corresponding to the mood
- Following/ Adding a playlist to the library
- Spotify Web Player

## Demo Video
[![Video](https://img.youtube.com/vi/j_FS7d0ntEw/0.jpg)](https://youtu.be/j_FS7d0ntEw)

## Instructions
The instructions in running this full-stack application locally are:

  1. Head towards the **spotify_webapp** directory and `cd authorization_code`
  2. Open a command line (preferably Bash) and export the keys i.e. `EXPORT CLIENT_ID=12326DSAD...` and `EXPORT CLIENT_SECRET=GSAJSDA4...`towards there.
  3. After exporting, execute the auth-server app with `node server.js`. The SpotiFace Homepage should be available for login.
  4. Once the auth-server is successful, head towards the **fer_model** directory
  5. The virtual environment from Anaconda is activated with `activate fypfinale`. This is mandatory as it contains packages for running the system.
  6. Set the flask server with `set FLASK_APP=ferplayer.py`
  7. Run the application with `flask run --host=0.0.0.0`. Voila!
  8. The full-stack application should be up and running for facial expression recognition, score predictions, recommendations and some music!
  



  
