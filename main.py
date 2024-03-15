import flask

app = flask.Flask(__name__)

@app.get('/')
def home():
    return flask.jsonify({'hello'})

if __name__ == '__main__':
    app.run(debug=True)