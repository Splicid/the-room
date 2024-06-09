from flask import request, Flask
from flask_cors import CORS
from flask_socketio import SocketIO, emit

app = Flask(__name__)
CORS(app)

socketio = SocketIO(app, cors_allowed_origins="http://localhost:5173")

use_list = {}



#Routes for messages
@socketio.on('message')
def my_event(userData):
    use_list[userData['username']] = userData['userId']
    print(use_list)


#Routes for data 
@app.route("/", methods=['POST'])
def hello_world():
    name = request.form.get('username')
    return "Test"

if __name__ == '__main__':
    socketio.run(app)