from flask import request, Flask, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room

app = Flask(__name__)
CORS(app, supports_credentials=True)

socketio = SocketIO(app, cors_allowed_origins="http://localhost:5173")
use_list = {}
room = 'main-room'

# client connections -> Adds the user to dictionary to keep track of usernames
@socketio.on('client_connection')
def my_event(data):
    current_user = data['username']
    if current_user in use_list:
        error_message = 'Username is already taken'
        emit('error', error_message)
    else:   
        use_list[data['username']] = data['userId']
        join_room(room)
        print(current_user + ' has entered the room.')
        emit('user_connected', use_list)
    print(use_list)

# Handle the join room event
@socketio.on('join_room')
def handle_join_room(data):
    join_room(data['room'])
    print(f"User joined room: {data['room']}")

# client disconnections -> Clears current users name/Id
@socketio.on('client_disconnected')
def user_joined(data):
    current_user = data['data']['username']
    if current_user in use_list:
        leave_room(room)
        print(current_user + ' has left the room.')
        use_list.pop(current_user)

@socketio.on('send')
def send_chat(data):
    inv_map = {v: k for k, v in use_list.items()}
    current_user = inv_map[data]
    print(data)
    emit('send_chat', current_user)

# Routes for data 
@app.route("/", methods=['POST'])
def hello_world():
    print(request.cookies.get('userId'))
    if 'userId' in request.cookies:
        return 'We have a cookie'
    else:
        return 'We didnt find anything'

if __name__ == '__main__':
    socketio.run(app)
