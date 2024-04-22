import os
import numpy as np
from tensorflow import keras
from tensorflow.keras.preprocessing.image import ImageDataGenerator # type: ignore
from keras.models import Sequential
from keras.layers import Conv2D, MaxPooling2D, Flatten, Dense

# Path to your dataset
dataset_path = "dataset/files"

# Image dimensions
img_width, img_height = 150, 150
input_shape = (img_width, img_height, 3)

# Parameters
epochs = 10
batch_size = 32
num_classes = 10

# Create image data generators
# Data augmentation will be applied to the training data
train_datagen = ImageDataGenerator(rescale=1./255)

# Generate image data from the dataset
# Set the target_size to the same as the image dimensions
# Batch size is the number of images to be processed in parallel
# Set class_mode to 'categorical' to convert integer class labels to categorical labels
# The classes argument specifies the list of class labels to be used
train_generator = train_datagen.flow_from_directory(
    dataset_path,
    target_size=(img_width, img_height),
    batch_size=batch_size,
    class_mode='categorical',
    classes=['acne', 'bags', 'redness', 'normal', 'dry', 'oily', 'wrinkles', 'pores', 'puffy_eyes', 'darkspots']
)

# Define the model
# The first layer is a convolutional layer with 32 filters
# The kernel size is 3x3
# The activation function is ReLU (Rectified Linear Unit)
# The input shape is set to the image dimensions
model = Sequential([
    Conv2D(32, (3, 3), activation='relu', input_shape=input_shape),
    # Max pooling layer with pool size 2x2
    MaxPooling2D((2, 2)),
    # Another convolutional layer with 64 filters
    Conv2D(64, (3, 3), activation='relu'),
    # Another max pooling layer with pool size 2x2
    MaxPooling2D((2, 2)),
    # Convolutional layer with 128 filters
    Conv2D(128, (3, 3), activation='relu'),
    # Another max pooling layer with pool size 2x2
    MaxPooling2D((2, 2)),
    # Convolutional layer with 128 filters
    Conv2D(128, (3, 3), activation='relu'),
    # Another max pooling layer with pool size 2x2
    MaxPooling2D((2, 2)),
    # Flatten the output shape of the 2D features into a 1D array
    Flatten(),
    # Dense layer with 512 neurons
    Dense(512, activation='relu'),
    # Output layer with a softmax activation function (to output probabilities)
    # and a num_classes=10, as there are 10 classes
    Dense(num_classes, activation='softmax')
])

# Compile the model
# Adam optimizer is used
# Categorical cross-entropy loss function is used
# Accuracy metric is also tracked
model.compile(optimizer='adam',
              loss='categorical_crossentropy',
              metrics=['accuracy'])

# Train the model
# Use the train_generator to get batches of training data
# Calculate the number of steps (number of batches) using the samples attribute
# of the train_generator, divided by the batch size
model.fit(
    train_generator,
    steps_per_epoch=train_generator.samples // batch_size,
    epochs=epochs
)

# Save the model
# Save the model to the current directory with the filename skin_analysis_model.h5
model.save("skin_analysis_model.h5")

print("Model trained and saved successfully.")

