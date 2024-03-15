import flask

app = flask.Flask()

@app.get('/')
def home():
    return flask.jsonify({'hello'})

app.run(debug=True)