import os
import subprocess
import pandas as pd
from flask import Flask, request, send_file, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import re
from collision_csv_v2 import detection  
from syncing import sync_sound
from moviepy.editor import VideoFileClip
from pydub import AudioSegment

# ----------------- App Setup -----------------
app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'  # You can switch to PostgreSQL/MySQL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

# ----------------- Constants -----------------
TRACKNET_ENV_PYTHON = "/home/valarmorghulis/Desktop/fyp_backend/TrackNet_V3/venv/bin/python"
TRACKNET_SCRIPT = "/home/valarmorghulis/Desktop/fyp_backend/TrackNet_V3/predict.py"
TRACKNET_DIR = "/home/valarmorghulis/Desktop/fyp_backend/TrackNet_V3"
# PREDICTION_FOLDER = "/home/valarmorghulis/Desktop/fyp_backend/collision_result"
PREDICTION_FOLDER = "collision_result"
UPLOAD_FOLDER = "uploaded_videos"
#DECTECTED_CSV_PATH = "/home/valarmorghulis/Desktop/fyp_backend/TrackNet_V3/pred_result/match_21.csv"
DECTECTED_CSV_PATH = "tracknet_detection" # hardcoded for now
AUDIO_FILE = "sound_sync\\table.mp3"
MAX_DURATION = 20  # seconds
ALLOWED_VIDEO_EXTENSIONS = {'mp4'}
ALLOWED_AUDIO_EXTENSIONS = {'mp3', 'wav'}

os.makedirs(PREDICTION_FOLDER, exist_ok=True)

# ----------------- Models -----------------
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

# ----------------- Auth Routes -----------------
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')
    confirm_password = data.get('confirm_password')

    if not all([email, username, password, confirm_password]):
        return jsonify({'error': 'All fields are required'}), 400
    if password != confirm_password:
        return jsonify({'error': 'Passwords do not match'}), 400
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({'error': 'Invalid email address'}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 400

    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(email=email, username=username, password_hash=password_hash)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({'error': 'Invalid credentials'}), 401

    return jsonify({'message': f'Welcome, {user.username}'}), 200

# ----------------- Upload Route -----------------
@app.route("/upload", methods=["POST"])

def upload_video():
    print("Starting Video Upload...")
    if "video" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    print("Given Video Found...")
    video_file = request.files["video"]
    filename = video_file.filename

    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
        print(f"Created {UPLOAD_FOLDER}")

    file_path = os.path.join(UPLOAD_FOLDER, filename)
    print(f"File at: {file_path}")

    if not allowed_file(filename, ALLOWED_VIDEO_EXTENSIONS):
        return jsonify({"error": "Invalid video format. Only .mp4 is allowed."}), 400
    
    print("File Cleared MP4 Check")
    video_file.save(file_path)
    print(f"File Saved at {file_path}")
    try:
        # Run TrackNet if needed
        # run_tracknet(file_path)
        video_duration = get_video_duration(file_path)
        if video_duration > MAX_DURATION:
            return jsonify({"error": f"Video is too long ({video_duration:.1f}s). Max 15s allowed."}), 400
        
        print("Video Length is OK ( < 15s)")

        if not os.path.exists(DECTECTED_CSV_PATH):
            os.makedirs(DECTECTED_CSV_PATH)
            print(f"Created {DECTECTED_CSV_PATH}")
        csv_name = filename.split('.')[0] + '.csv' # this was missing

        csv_path = os.path.join(DECTECTED_CSV_PATH, csv_name)
        print(f"CSV Path: {csv_path}")
        collision_result = detection(csv_path) # TrackNet will give detected co ordinates in a CSV. This is that csv

        print("Collisions Found!")
        collision_filename = os.path.splitext(filename)[0] + "_collision_detection.csv"
        collision_path = os.path.join(PREDICTION_FOLDER, collision_filename)
        collision_result.to_csv(collision_path, index=False)
        print(f"Collisions File Saved at {collision_path}")

        if not isinstance(file_path, str):
            raise ValueError(f"video_file should be a string, got {type(file_path)}")

        result_path = sync_sound(csv_path, collision_path, file_path, AUDIO_FILE, volume=100, reverb=0, pitch=50, noise_reduction=0)
        if result_path:
            print(f"Results at {result_path}")

        return send_file(result_path, mimetype="video/mp4", as_attachment=True)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -----------------Custom Audio -----------------
@app.route("/uploadWithAudio", methods=["POST"])
def upload_video_and_audio():
    if "video" not in request.files or "audio" not in request.files:
        return jsonify({"error": "Video and audio files are required"}), 400

    video_file = request.files["video"]
    audio_file = request.files["audio"]

    video_filename = video_file.filename
    audio_filename = audio_file.filename

    if not allowed_file(video_filename, ALLOWED_VIDEO_EXTENSIONS):
        return jsonify({"error": "Invalid video format. Only .mp4 is allowed."}), 400
    if not allowed_file(audio_filename, ALLOWED_AUDIO_EXTENSIONS):
        return jsonify({"error": "Invalid audio format. Only .mp3 or .wav is allowed."}), 400

    video_path = os.path.join(PREDICTION_FOLDER, video_filename)
    audio_path = os.path.join(PREDICTION_FOLDER, audio_filename)

    video_file.save(video_path)
    audio_file.save(audio_path)

    try:
        video_duration = get_video_duration(video_path)
        audio_duration = get_audio_duration(audio_path)

        #ali: chainging code to take long audio up to 0.5s
        if video_duration > MAX_DURATION:
            return jsonify({"error": f"Video is too long ({video_duration:.1f}s). Max 15s allowed."}), 400
        if audio_duration > 0.5:
            return jsonify({"error": f"Audio is too long ({audio_duration:.1f}s). Max 0.1s allowed."}), 400
        
        #ali: changing code to will because i can
        # if not os.path.exists(DECTECTED_CSV_PATH):
        #     os.makedirs(DECTECTED_CSV_PATH)
        #     print(f"Created {DECTECTED_CSV_PATH}")
        # csv_name = video_filename.split('.')[0] + '.csv'
        # csv = os.path.join(DECTECTED_CSV_PATH, csv_name)
        
        #ali: tracknet not working so no need to get name of video
        csv='tracknet_detection\match_68.csv'
        collision_result = detection(csv)
        collision_filename = os.path.splitext(video_filename)[0] + "_collision_detection.csv"
        collision_path = os.path.join(PREDICTION_FOLDER, collision_filename)
        collision_result.to_csv(collision_path, index=False)

        result_path = sync_sound(csv, collision_path, video_path, audio_path, volume=100, reverb=0, pitch=50, noise_reduction=0)

        return send_file(result_path, mimetype="video/mp4", as_attachment=True)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        if os.path.exists(audio_path):
            os.remove(audio_path)

# -----------------Augment sound with sliders -----------------
@app.route("/augmentSound", methods=["POST"])
def sound_augment():
    if "video" not in request.files:
        return jsonify({"error": "Missing video file"}), 400

    video_file = request.files["video"]
    video_filename = video_file.filename

    if not allowed_file(video_filename, ALLOWED_VIDEO_EXTENSIONS):
        return jsonify({"error": "Invalid video format. Only .mp4 is allowed."}), 400
    
    video_path = os.path.join(PREDICTION_FOLDER, video_filename)

    video_file.save(video_path)
    

    # Parse slider values (assume they come as form fields)
    try:
        volume = float(request.form.get("volume", 1.0))
        reverb = float(request.form.get("reverb", 0.0))
        pitch = float(request.form.get("pitch", 0.0))
        noise_reduction = float(request.form.get("noise_reduction", 0.0))
    except ValueError:
        return jsonify({"error": "Invalid slider values"}), 400

    try:
        video_duration = get_video_duration(video_path)

        if video_duration > MAX_DURATION:
            return jsonify({"error": f"Video is too long ({video_duration:.1f}s). Max 15s allowed."}), 400
        
        #ali: changing code to will because i can
        # if not os.path.exists(DECTECTED_CSV_PATH):
        #     os.makedirs(DECTECTED_CSV_PATH)
        #     print(f"Created {DECTECTED_CSV_PATH}")
        # csv_name = video_filename.split('.')[0] + '.csv'
        # csv = os.path.join(DECTECTED_CSV_PATH, csv_name)
        
        #ali: tracknet not working so no need to get name of video
        csv='tracknet_detection\match_68.csv'
        collision_result = detection(csv)
        collision_filename = os.path.splitext(video_filename)[0] + "_collision_detection.csv"
        collision_path = os.path.join(PREDICTION_FOLDER, collision_filename)
        collision_result.to_csv(collision_path, index=False)

        result_path = sync_sound(csv, collision_path, video_path, AUDIO_FILE, volume=volume, reverb=reverb, pitch=pitch, noise_reduction=noise_reduction)
        return send_file(result_path, mimetype="video/mp4", as_attachment=True)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ----------------- Helper -----------------
def allowed_file(filename, allowed_extensions):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions


def get_video_duration(path):
    clip = VideoFileClip(path)
    return clip.duration  # in seconds

def get_audio_duration(path):
    audio = AudioSegment.from_file(path)
    return len(audio) / 1000.0  # convert ms to seconds

def run_tracknet(video_path):
    video_name = os.path.basename(video_path)
    csv_path = os.path.join(PREDICTION_FOLDER, video_name.replace(".mp4", ".csv"))

    command = [
        TRACKNET_ENV_PYTHON, TRACKNET_SCRIPT,
        "--video_file", video_name,
        "--model_file", "exp/model_best.pt",
        "--save_dir", PREDICTION_FOLDER
    ]

    try:
        subprocess.run(command, check=True, cwd=TRACKNET_DIR)
        return csv_path
    except subprocess.CalledProcessError as e:
        raise RuntimeError(f"Error running TrackNet: {e}")

# ----------------- To get all   users  -----------------
@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()  # Query all users
    user_list = [
        {"id": user.id, "email": user.email, "username": user.username} 
        for user in users
    ]
    return jsonify({"users": user_list}), 200


# ----------------- Init DB -----------------
if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Create tables at the start
    app.run(debug=True)