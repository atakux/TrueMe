# Import the main TensorFlow library
from tensorflow import keras

# keras models to load a saved Keras model from a file
from keras.models import load_model

# keras preprocessing to load images from filepaths, convert them to numpy arrays
from keras.preprocessing import image

# PIL (Python Imaging Library) for loading and manipulating images
import PIL
from PIL import Image

# NumPy for numerical computations on arrays
import numpy as np

def predict(image_path):
    """
    This function takes an image path as input, loads the trained model,
    preprocesses the image, predicts the class, and returns a dictionary
    with class names as keys and corresponding probabilities as values.
    """
    print("Image path:", image_path)

    # Load the trained model
    model = load_model("skin_analysis_model.h5")

    # Load and preprocess the image
    img = image.load_img(image_path, target_size=(150, 150))
    # Convert the image to numpy array
    img_array = image.img_to_array(img)
    # Expand the shape of the image array to be 4D (batch size, height, width, channels)
    img_array = np.expand_dims(img_array, axis=0)
    # Normalize the pixel values to be between 0 and 1
    img_array = img_array / 255.0

    # Predict the class
    prediction = model.predict(img_array)

    # Define class indices
    class_indices = {0: 'acne', 1: 'bags', 2: 'redness', 3: 'normal', 4: 'dry', 5: 'oily', 6: 'wrinkles', 7: 'pores', 8: 'puffy_eyes', 9: 'darkspots'}

    predicted_class_dict = {}

    # Loop through the prediction array and add the class names and probabilities to a dictionary
    for i, p in enumerate(prediction[0]):
        # Convert numpy float32 to Python float
        predicted_class_dict[class_indices[i]] = float(p)

    # Get the predicted class label (the index of the class with the highest probability)
    predicted_class_index = np.argmax(prediction)
    # Get the class name corresponding to the predicted class label
    predicted_class = class_indices[predicted_class_index]

    print("Predicted class:", predicted_class)

    return predicted_class_dict
