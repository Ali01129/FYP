from moviepy.editor import VideoFileClip, AudioFileClip, CompositeAudioClip
import pandas as pd
import librosa
import numpy as np
import soundfile as sf
from scipy.signal import find_peaks
from pysndfx import AudioEffectsChain

# Define the audio effect chain (flanger removed)
fx = (
    AudioEffectsChain()
    .reverb()
)

def apply_audio_effects(input_audio, output_audio, volume=100, reverb=0, pitch=50, noise_reduction=0):
    """Apply audio effects based on slider values and save the modified audio."""
    print("\tApplying Audio Effects")
    y, sr = librosa.load(input_audio, sr=None)
    print("\tInput Audio Loaded")
    # 1. Volume scaling (100 = normal, 50 = half, 200 = double)
    y = y * (volume / 100.0)
    print("\tVolume Modified")
    # 2. Pitch shifting (-5 to +5 semitones mapped from 0–100)
    if pitch != 50:
        shift = (pitch - 50) / 10.0  # Midpoint 50 = no change
        y = librosa.effects.pitch_shift(y, sr=sr, n_steps=shift)
    print("\tPitch Modified")
    # 3. Noise reduction (basic preemphasis — crude but usable)
    if noise_reduction > 0:
        y = librosa.effects.preemphasis(y, coef=noise_reduction / 100.0)
    print("\tNoise Reduction Applied")
    # 4. Reverb using pysndfx (if reverb > 0)

    # ali: changing code so if the reverb library is not found, it will skip the reverb effect
    fx = AudioEffectsChain()
    try:
        if reverb > 0:
            fx = fx.reverb(reverberance=reverb)
            y_effected = fx(y)
            print("\tReverb Applied")
        else:
            y_effected = y
            print("\tReverb was Zero")
    except FileNotFoundError:
        print("\t[Warning] SoX not found — skipping reverb.")
        y_effected = y
    
    # 5. Apply exponential fade from first peak
    energy = np.abs(y_effected)
    peaks, _ = find_peaks(energy, height=np.max(energy) * 0.7, distance=sr // 10)
    print("\tExponential Fade Starting")
    if len(peaks) > 0:
        peak_start = peaks[0]
        fade_start = peak_start
        fade_end = len(y_effected)
        fade_duration = fade_end - fade_start

        alpha = 5 / fade_duration
        fade_curve = np.exp(-alpha * np.arange(fade_duration))

        y_faded = y_effected.copy()
        y_faded[:fade_start] *= 0.2
        y_faded[fade_start:] *= fade_curve
        print("\tExponential Fade Applied")
        sf.write(output_audio, y_faded, sr)
    else:
        print("\tExponential Fade Not Applied. Saving Rest of Effects")
        sf.write(output_audio, y_effected, sr)
    print(f"\tProcessed Audio Saved at {output_audio}")
    return output_audio
def sync_sound(detection_path, collision_path, video_file, audio_file, volume, reverb, pitch, noise_reduction):
    """Sync sound based on collision detection, apply effects, and merge audio with video."""
    print("Starting Audio Sync")
    print(detection_path)
    print(collision_path)
    print(video_file)
    print(audio_file)
    df = pd.read_csv(collision_path)
    total_frame = pd.read_csv(detection_path)

    # Process the audio file with effects and fading
    processed_audio_file = "processed_audio.mp3"
    out = apply_audio_effects(audio_file, processed_audio_file, volume, reverb, pitch, noise_reduction)
    print(out)

    # Load the video and the processed audio
    video = VideoFileClip(video_file)
    audio = AudioFileClip(processed_audio_file)

    # Step 1: Find impact points in processed audio
    y, sr = librosa.load(processed_audio_file, sr=None)
    energy = np.abs(y)
    peaks, _ = find_peaks(energy, height=np.max(energy) * 0.7, distance=sr // 10)
    peak_times = peaks / sr if len(peaks) > 0 else [0]  # Avoid errors if no peaks detected

    # Frame-based calculations
    #total_frames = len(total_frame) - 1
    marked_frames = list(df['Frame'])
    fps = video.fps  
    frame_seconds = [frame / fps for frame in marked_frames]

    # Define volume scaling for different velocities
    vels = np.array([14, 10, 7, 16, 9, 11, 18, 14, 7, 50, 60, 94, 94] * 4)
    vels = vels / np.max(vels)  # Normalize to range [0,1]

    # Create audio clips at detected frames
    audio_clips = []
    for i, start_time in enumerate(frame_seconds):
        audio_clip = audio.set_start(start_time - peak_times[0])
        audio_clips.append(audio_clip.volumex(vels[i]))

    # Merge all audio clips
    final_audio = CompositeAudioClip(audio_clips)
    video = video.set_audio(final_audio)

    # Save final video
    result_path = video_file.split(".")[0] + "_result.mp4"
    video.write_videofile(result_path, codec="libx264", audio_codec="aac", temp_audiofile='temp-audio.m4a', remove_temp=True)

    return result_path
