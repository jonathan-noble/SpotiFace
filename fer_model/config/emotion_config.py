#import the necessary packages
from os import path

# define the base path to the emotion dataset
BASE_PATH = r"C:\Users\schma\Documents\4th Yr\FYP\FINALE\FYP_Software201819\fer_model"

INPUT_PATH = path.sep.join([BASE_PATH,  r"fer2013\datasets\fer2013.csv"])

# define the number of classes (set to 6 if you are ignoring "disgust" class
NUM_CLASSES = 6

print(INPUT_PATH)

TRAIN_HDF5 = path.sep.join([BASE_PATH, r"fer2013\hdf5\train.hdf5"])
VAL_HDF5 = path.sep.join([BASE_PATH, r"fer2013\hdf5\val.hdf5"])
TEST_HDF5 = path.sep.join([BASE_PATH, r"fer2013\hdf5\test.hdf5"])

#define the batch size
BATCH_SIZE = 128

# define the path to where output logs will be stored
OUTPUT_PATH = path.sep.join([BASE_PATH, r"fer2013\output"])

