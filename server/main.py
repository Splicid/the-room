from flask import request, Flask, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit

app = Flask(__name__)
CORS(app)

socketio = SocketIO(app, cors_allowed_origins="http://localhost:5173")
use_list = {}

# client connections -> Adds the user to dictionary to keep track of usernames
@socketio.on('client_connection')
def my_event(data):
    current_user = data['username']
    if current_user in use_list:
        error_message = 'Username is already taken'
        emit('error', error_message)
    else:   
        use_list[data['username']] = data['userId']
        print('we got here')
        emit('user_connected', use_list)
    print(use_list)

# client disconnections -> Clears current users name/Id
@socketio.on('client_disconnected')
def user_joined(data):
    current_user = data['data']['username']
    if current_user in use_list:
        use_list.pop(current_user)
    print(use_list)

# @socketio.on('connection')
# def user_disconnect():
#     print('A user has connected')

#Routes for data 
@app.route("/", methods=['POST'])
def hello_world():
    name = request.form.get('username')
    return "Test"

if __name__ == '__main__':
    socketio.run(app)