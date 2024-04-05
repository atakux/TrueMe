from tensorflow import keras
from keras.models import load_model
from keras.preprocessing import image
import numpy as np

def predict(image_path):
    print("Image path:", image_path)
    # Load the trained model
    model = load_model("skin_analysis_model.h5")

    # Load and preprocess the image
    img = image.load_img(image_path, target_size=(150, 150))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0  # Normalize pixel values

    # Predict the class
    prediction = model.predict(img_array)

    # Define class indices
    class_indices = {0: 'acne', 1: 'bags', 2: 'redness', 3: 'normal', 4: 'dry', 5: 'oily', 6: 'wrinkles', 7: 'pores', 8: 'puffy_eyes', 9: 'darkspots'}

    predicted_class_dict = {}
    
    # Print the class index with the corresponding prediction
    for i, p in enumerate(prediction[0]):
        # print(f"{class_indices[i]}: {p}")
        predicted_class_dict[class_indices[i]] = float(p)  # Convert numpy float32 to Python float

    # Get predicted class label
    predicted_class_index = np.argmax(prediction)
    predicted_class = class_indices[predicted_class_index]

    print("Predicted class:", predicted_class)
    
    return predicted_class_dict
