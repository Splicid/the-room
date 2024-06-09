from flask import request, Flask
from flask_cors import CORS
from flask_socketio import SocketIO

app = Flask(__name__)
CORS(app)


socketio = SocketIO(app, cors_allowed_origins="*")

@socketio.on('connection')
async def my_event(sid, data):
    print('My Event')

@app.route("/", methods=['POST'])
def hello_world():
    name = request.form.get('username')
    return "Test"