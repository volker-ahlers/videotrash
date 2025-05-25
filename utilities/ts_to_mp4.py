import subprocess
import sys

def convert_ts_to_mp4(ts_file_path, mp4_file_path):
    try:
        subprocess.run(["ffmpeg", "-i", ts_file_path, "-c:v", "libx264", "-c:a", "aac", "-strict", "experimental", mp4_file_path])
        print(f"Conversion successful: {ts_file_path} to {mp4_file_path}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    ts_file_path = "C:/Users/ui931716/Documents/GitHub/Frontend/utilities/00000.ts"
    mp4_file_path = "C:/Users/ui931716/Documents/GitHub/Frontend/utilities/00000.mp4"
    convert_ts_to_mp4(ts_file_path, mp4_file_path)