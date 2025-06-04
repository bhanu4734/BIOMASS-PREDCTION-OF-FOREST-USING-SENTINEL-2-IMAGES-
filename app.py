from flask import Flask, render_template, request, jsonify
import numpy as np
from sklearn.ensemble import RandomForestRegressor
# Import your model and preprocessing functions here

app = Flask(__name__)

# Load your trained model here
# model = load_model()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    
    # Example prediction logic (replace with your actual model)
    # This is a placeholder that returns dummy data
    dummy_prediction = {
        'totalBiomass': round(np.random.normal(500, 100) * data['area'], 2),
        'carbonStorage': round(np.random.normal(250, 50) * data['area'], 2),
        'biomassDensity': round(np.random.normal(100, 20), 2)
    }
    
    return jsonify(dummy_prediction)

if __name__ == '__main__':
    app.run(debug=True)