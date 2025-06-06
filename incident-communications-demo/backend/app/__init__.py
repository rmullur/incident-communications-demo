from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

socketio = SocketIO()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    app.config['OPENAI_API_KEY'] = os.getenv('OPENAI_API_KEY')
    
    # Initialize CORS - get allowed origins from env
    allowed_origins = os.getenv('ALLOWED_ORIGINS', 'http://localhost:5173').split(',')
    CORS(app, resources={
        r"/api/*": {
            "origins": allowed_origins,
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type"]
        }
    })

    socketio.init_app(app)

    # Register incident routes
    from app.incident.routes import incident_bp
    app.register_blueprint(incident_bp)

    return app 