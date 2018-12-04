# emotion-detection-player: Final Year Project

The dataset I acquired is from https://www.kaggle.com/c/challenges-in-representation-learning-facial-expression-recognition-challenge/data
The computer vision fundamentals, deep learning knowledge and sample codes that have significantly aided this project
is from a book bundle "Deep Learning For Computer Vision" by Dr. Adrian Rosebrock.

> config/emotion_config.py
		The configuration for paths and where NUM_CLASSES and BATCH_SIZE are defined.

> checkpoints
		The current model compressed in an HDF5 file is placed here.

> pyimagesearch/callbacks
		This directory consists of two python scripts that consists of epoch_checkpoints.py that saves the model for every given number
		and training_monitor.py used for illustrating the loss/accuracy plot of the current model.

> pyimagesearch/io		
		This directory is responsible for writing and loading the hdf5 files for further use.
		
> pyimagesearch/nn/conv/emotionvggnet.py
		The vgg-like network class is defined here.
		
> pyimagesearch/preprocessing/imagetoarraypreprocessor.py	
		This is used for converting the images into a readable dimension for the datasets. 

> build_dataset.py
		The fer2018.csv file is ingested here where each instance i.e. image along with their corresponding labels are compressed in hdf5 files by their respective usage.
		
> train_recognizer.py
		All the relevant packages for the config, model, hdf5datasetgenerator, epochcheckpoint, trainingmonitor, Adam optimizers, imagetoarraypreprocessor,
		imagedatagenerator and more are used here for training purposes.

> test_recognizer.py
		For testing the accuracy of the current model. 
		
> haarcascade_frontalface_default.xml
		Essential cascade for face recognition.
		
>emotion_detector.py
		A cv2 package is used for developing a real-time face detection application, alongside its model applied for predicting in real-time.
		
>visualize_architecture.py
		This script is used to produce the architecture of the CNN model. 