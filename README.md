# Emotion Detection Player: Final Year Project [![Build Status](https://travis-ci.org/jonathan-noble/emotion-detection-player.svg?branch=master)](https://travis-ci.org/jonathan-noble/emotion-detection-player)

An application system comprising a real-time facial expression recognition algorithm that detects the user's current emotion(ranging from six emotions: happy, sad, angry, neutral, fear and surprise) and a media player exhibited under a web application which caters the best suitable music genre or video category according to the detected emotion.
It would serve to be very convenient for modern music player applications such as Spotify or YouTube Music to be able to acquire a feature that extracts real-time facial emotion inputs from the user and outputs a playlist of songs or videos for the user's entertainment.

The computer vision fundamentals, deep learning knowledge and sample codes that have significantly aided the Facial Expression Recognition (FER) model is from a book bundle "Deep Learning For Computer Vision" by Dr. Adrian Rosebrock. Moreover, the dataset I acquired is from a [Kaggle Contest](https://www.kaggle.com/c/challenges-in-representation-learning-facial-expression-recognition-challenge/data). The aforementioned (FER) model is stored under the **fer_model** directory.


The state-of-the-art web application built under the Node.js platform which uses the Express framework, React and the well-documented [API from Spotify](https://developer.spotify.com/documentation/web-api/) to create services corresponding to the labelled mood of the first component (FER model). This component is stored under the **spotify_webapp** directory.
