import requests

def upload_image(file_path):
    url = "http://localhost:8000/upload/"
    files = {"image": open(file_path, "rb")}
    response = requests.post(url, files=files)
    return response.json()

if __name__ == "__main__":
    file_path = "path/to/your/image.jpg"
    response = upload_image(file_path)
    print(response)
