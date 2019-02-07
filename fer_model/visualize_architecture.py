# import the necessary packages
from keras.utils import plot_model
from fer_model.pyimagesearch.nn.conv import emotionvggnet as vggnet
from fer_model.config import emotion_config as config

count = 3

plot_model(vggnet.EmotionVGGNet.build(width=48, height=48, depth=1, classes=config.NUM_CLASSES), to_file="visuals/architecture/vgg" + count + ".png", show_shapes=True)

