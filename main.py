from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello():
    return '<h1>Xin chào, đây là ứng dụng Flask cơ bản!</h1>'

if __name__ == '__main__':
    app.run(debug=True)
