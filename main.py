import flask

app = flask.Flask(__name__)

@app.get('/')
def home():
    return flask.jsonify({'hello'})

app.run(debug=True)