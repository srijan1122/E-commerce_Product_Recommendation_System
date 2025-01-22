from flask import Flask, render_template, request, redirect, jsonify
import os
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pickle
from dotenv import load_dotenv

load_dotenv()

MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'trained_dataset.pkl')

try:
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model file not found at: {MODEL_PATH}")
    
    with open(MODEL_PATH, 'rb') as f:
        train_data_df = pickle.load(f)
except Exception as e:
    print(f"Error loading model: {str(e)}")
    raise


app = Flask(__name__)

@app.route('/firebase-config')
def get_firebase_config():
    required_keys = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"]
    
    try:
        firebase_config = {
            key: os.getenv(key) for key in required_keys
        }
        
        # Check if any required keys are missing
        missing_keys = [key for key, value in firebase_config.items() if value is None]
        if missing_keys:
            raise ValueError(f"Missing required environment variables: {', '.join(missing_keys)}")
            
        return jsonify(firebase_config)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/recommend')
def recommend_page():
    return render_template('rec.html')

@app.route('/recommend_products', methods=['post'])
def recommend_products():
    user_input = request.form.get('user_input')
    
    top_n = 10
    
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(train_data_df['about'])
    
    query_vector = tfidf.transform([user_input])
    
    similarities = cosine_similarity(query_vector, tfidf_matrix).flatten()
    
    top_indices = similarities.argsort()[-top_n:][::-1]
    
    recommendations = train_data_df.iloc[top_indices].sort_values('rating', ascending=False)
    
    recommend_products = recommendations[['pname', 'img', 'rating']]
    
    data = {
        'names': recommend_products['pname'].tolist(),
        'images': recommend_products['img'].tolist(),
        'ratings': recommend_products['rating'].tolist()
    }
    
    return render_template('rec.html', data=data)


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        confirm_password = request.form['confirm_password']
        email = request.form.get('email')
        
        if password != confirm_password:
            return "Passwords do not match!"
        
        # Placeholder for user registration logic
        return redirect('/login')
    
    return render_template('reg.html')

@app.route('/login')
def login():
    return render_template('login.html')


if __name__ == '__main__':
    app.run(debug=False)