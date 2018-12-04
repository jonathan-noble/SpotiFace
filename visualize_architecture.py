# import the necessary packages
from keras.utils import plot_model
from pyimagesearch.nn.conv import emotionvggnet as vggnet
from config import emotion_config as config

plot_model(vggnet.EmotionVGGNet.build(width=48, height=48, depth=1, classes=config.NUM_CLASSES), to_file="vgg.png", show_shapes=True)

