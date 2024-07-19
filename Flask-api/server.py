from flask import Flask
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@app.route('/')
def index():
    return 'hi'

@socketio.on('message')
def handle_message(msg):
    print('Message: {}'.format(msg))
    # socketio.emit('message', msg)
 
if __name__ == '__main__':
    socketio.run(app, debug=True,port=5000)
