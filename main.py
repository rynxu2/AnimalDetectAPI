from fastapi import FastAPI, File, UploadFile
import numpy as np
import keras
from keras.preprocessing import image
from pydantic import BaseModel

class Image(BaseModel):
    file: bytes

app = FastAPI()
model = keras.models.load_model('model_resnet.h5')

# def predict_image(file):
#     img = image.load_img(file_path, target_size=(224, 224))
#     x = image.img_to_array(img)
    
#     x=x/255
#     x = np.expand_dims(x, axis=0)

#     preds = model.predict(x)
#     preds=np.argmax(preds, axis=1)
#     if preds==0:
#         preds="butterfly"
#     elif preds==1:
#         preds="cat"
#     elif preds==2:
#         preds="chicken"
#     elif preds==3:
#         preds="cow"
#     elif preds==4:
#         preds="dog"
#     elif preds==5:
#         preds="duck"
#     elif preds==6:
#         preds="elephant"
#     elif preds==7:
#         preds="goat"
#     elif preds==8:
#         preds="goose"
#     elif preds==9:
#         preds="horse"
#     elif preds==10:
#         preds="pig"
#     elif preds==11:
#         preds="pigeon"
#     elif preds==12:
#         preds="sheep"
#     elif preds==13:
#         preds="spider"
#     elif preds==14:
#         preds="squirrel"

#     result_label.configure(text=f'Predicted label: {preds}')
#     print(preds)

@app.get('/')
def home():
    return "hello"

@app.post("/upload/")
async def upload_image(image: UploadFile = File(...)):
    contents = await image.read()
    return {"filename": image.filename, "content_type": image.content_type, "size": len(contents)}
