from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np

# Load the trained model
model = load_model("skin_analysis_model.h5")

# Path to the new image
new_image_path = input("Enter the path to the new image: ")

# Load and preprocess the image
img = image.load_img(new_image_path, target_size=(150, 150))
img_array = image.img_to_array(img)
img_array = np.expand_dims(img_array, axis=0)
img_array = img_array / 255.0  # Normalize pixel values

# Predict the class
prediction = model.predict(img_array)
print(prediction)

# Define class indices
class_indices = {0: 'acne', 1: 'bags', 2: 'redness'}

# Get predicted class label
predicted_class_index = np.argmax(prediction)
predicted_class = class_indices[predicted_class_index]

print("Predicted class:", predicted_class)
