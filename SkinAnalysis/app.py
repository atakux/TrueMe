from Predict import predict
from flask import Flask, request, jsonify
from PIL import Image
import io
import numpy as np

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict_endpoint():
    """
    This function is the endpoint for the Flask app. When the app receives a POST request at /predict, it extracts the image data from the request, passes it to the predict function in the Predict module, and returns a JSON response with the prediction.
    """
    try: 
        print("Received request")
        image_data = request.files['image'].read()
        print("Image data length:", len(image_data))  # Debugging

        # Convert image data to io.BytesIO object
        image_bytes = io.BytesIO(image_data)
        
        prediction = predict(image_bytes)
        print("Prediction:", prediction)  # Debugging
        
        # Convert numpy floats to Python floats
        prediction = {key: float(value) for key, value in prediction.items()}
        
        return jsonify({'success': True, 'message': 'Image received and processed successfully', 'prediction': prediction})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
