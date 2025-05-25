import os, uuid
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
import subprocess

def convert_ts_to_mp4(ts_file_path, mp4_file_path):
    subprocess.run(["ffmpeg", "-i", ts_file_path, "-c:v", "libx264", "-c:a", "aac", "-strict", "experimental", mp4_file_path])

def download_blob(blob_service_client, container_name, blob_name, download_file_path):
    blob_client = blob_service_client.get_blob_client(container=container_name, blob=blob_name)
    blob_data = blob_client.download_blob()
    with open(download_file_path, "wb") as f:
        f.write(blob_data.readall())

def upload_blob(blob_service_client, container_name, blob_name, upload_file_path):
    blob_client = blob_service_client.get_blob_client(container=container_name, blob=blob_name)
    with open(upload_file_path, "rb") as f:
        blob_client.upload_blob(f.read(), overwrite=True)

try:
    account_url = "https://zc01xyumawrsnp00.blob.core.windows.net/"
    input_container = 'ai-video-streaming'

    default_credential = DefaultAzureCredential()
    blob_service_client = BlobServiceClient(account_url, credential=default_credential)
    container_client = blob_service_client.get_container_client('ai-video-streaming')
    
    for blob_info in container_client.list_blobs(name_starts_with="original/"):
        if blob_info.name.endswith('.ts'):
            ts_file_name = os.path.basename(blob_info.name)
            mp4_file_name = f"{os.path.splitext(ts_file_name)[0]}.mp4"

            download_path = f"temp/{ts_file_name}"
            upload_path = f"temp/{mp4_file_name}"

            # Download blob to temporary local file
            print(f"Downloading {blob_info.name}")
            download_blob(blob_service_client, input_container, blob_info.name, download_path)

            # Convert the downloaded file to mp4
            print(f"Converting {ts_file_name} to {mp4_file_name}")
            convert_ts_to_mp4(download_path, upload_path)

            # Upload the converted file back to Azure blob storage
            # print(f"Uploading {mp4_file_name} to {input_container}")
            # output_blob_name = blob_info.name.replace("original/", "original_converted/")
            # output_blob_name = output_blob_name.replace(".ts", ".mp4")
            # upload_blob(blob_service_client, input_container, output_blob_name, upload_path)

            # Delete temporary files
            os.remove(download_path)
except Exception as ex:
    print('Exception:')
    print(ex)