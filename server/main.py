from flask import request, Flask, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room

app = Flask(__name__)
CORS(app, supports_credentials=True)

socketio = SocketIO(app, cors_allowed_origins="http://localhost:5173")
use_list = {}
default_room = 'main-room'

@socketio.on('client_connection')
def my_event(data):
    current_user = data['username']
    if current_user in use_list:
        error_message = 'Username is already taken'
        emit('error', error_message)
    else:
        use_list[data['username']] = data['userId']
        join_room(default_room)
        print(current_user + ' has entered the room.')
        emit('user_connected', use_list, room=default_room)
    print(use_list)

@socketio.on('join_room')
def handle_join_room(data):
    room = data['room']
    user_id = data['userId']
    inv_map = {v: k for k, v in use_list.items()}
    username = inv_map.get(user_id)

    if username:
        join_room(room)
        print(f"{username} joined room: {room}")
        emit('room_joined', {'room': room, 'username': username}, room=room)
    else:
        print(f"User ID {user_id} not found in use_list")

@socketio.on('client_disconnected')
def user_disconnected(data):
    current_user = data['data']['username']
    if current_user in use_list:
        emit('send_chat', {'username': 'System', 'message': f'{current_user} has left the room.'}, room=default_room)
        leave_room(default_room)
        use_list.pop(current_user)

@socketio.on('send')
def send_chat(data):
    user_id = data.get('userId')
    message = data.get('message')

    if not user_id or not message:
        print("Invalid data received:", data)
        return

    inv_map = {v: k for k, v in use_list.items()}
    current_user = inv_map.get(user_id)

    if current_user:
        print(f"{current_user} sent a message: {message}")
        emit('send_chat', {'username': current_user, 'message': message}, room=default_room)
    else:
        print(f"User ID {user_id} not found in use_list")

@app.route("/", methods=['POST'])
def hello_world():
    print(request.cookies.get('userId'))
    if 'userId' in request.cookies:
        return 'We have a cookie'
    else:
        return 'We didnt find anything'

if __name__ == '__main__':
    socketio.run(app)