# Facial Expression Recognition Application

The whole application to create the model is coded in Python. 

### Getting started

Run `python emotion_detector.py --cascade haarcascade_frontalface_default.xml --model checkpoints/epoch_1.hdf5` in the terminal.

## Scripts

#### config/emotion_config.py
- The configuration for paths and where NUM_CLASSES and BATCH_SIZE are defined.

#### pyimagesearch/callbacks
- This directory consists of two python scripts that consists of epoch_checkpoints.py that saves the model for every given number
and training_monitor.py used for illustrating the loss/accuracy plot of the current model.

#### pyimagesearch/io	
- This directory is responsible for writing and loading the hdf5 files for further use.
		
#### pyimagesearch/nn/conv/emotionvggnet.py
- The vgg-like network class is defined here.
		
#### pyimagesearch/preprocessing/imagetoarraypreprocessor.py
- This is used for converting the images into a readable dimension for the datasets. 

#### build_dataset.py
- The fer2018.csv file is ingested here where each instance i.e. image along with their corresponding labels are compressed in hdf5 files by their respective usage.
		
#### train_recognizer.py
- All the relevant packages for the config, model, hdf5datasetgenerator, epochcheckpoint, trainingmonitor, Adam optimizers, imagetoarraypreprocessor, imagedatagenerator and more are used here for training purposes.

#### test_recognizer.py
- For testing the accuracy of the current model. 
		
#### emotion_detector.py
- A cv2 package is used alongside its trained model for developing a real-time face detection component. The serialised JSON file is also written and sent to the directory of the web application.
		
#### visualize_architecture.py

- This script is used to produce the architecture of the CNN model. 
  
## Files

#### fer2013 (not included in github due to memory purposes)
- The dataset, hdf5 files and output are stored here 

#### checkpoints
- The current model compressed in an HDF5 file is placed here.

#### haarcascade_frontalface_default.xml
- Essential cascade for face recognition.

#### visuals
- This directory contains the visualizations of the loss/accuracy per epoch and the architecture of the current model