from flask import Flask, render_template, request, send_file, flash, redirect, url_for
from flask_socketio import SocketIO, emit
from flask_fontawesome import FontAwesome
import flask_login
import domoticzCommunication, database
import time, json

app = Flask(__name__)
socketio = SocketIO(app)
fa = FontAwesome(app)

#authorization
login_manager = flask_login.LoginManager()
login_manager.init_app(app)
app.secret_key = 'super secret string'  # Change this!

users = {'foo@bar.tld': {'password': 'secretplik111'}}

class User(flask_login.UserMixin):
    pass

@login_manager.user_loader
def load_user(email):
  if email not in users:
    return
  user = User()
  user.id = email
  return user

@login_manager.request_loader
def requestLoader(request):
    email = request.form.get('email')
    if email not in users:
        return
    user = User()
    user.id = email
    user.is_authenticated = request.form['password'] == users[email]['password']
    return user

@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return '''
               <form action='/' method='POST'>
                <input type='text' name='email' id='email' placeholder='email'/>
                <input type='password' name='password' id='password' placeholder='password'/>
                <input type='submit' name='submit'/>
               </form>
               '''
    email = request.form['email']
    try:
      if request.form['password'] == users[email]['password']:
          user = User()
          user.id = email
          flask_login.login_user(user)
          return redirect(url_for('panel'))
      return login()
    except Exception as e:
      print(e)
      return login()

#end of authorization

@app.route('/data')
def names():
    data = {"names": ["John", "Jacob", "Julie", "Jennifer"]}
    return jsonify(data)

@app.route('/panel')
@flask_login.login_required
def panel():
  if domoticz.connectStatus:
    return render_template('desktop.html')
  else: 
    return render_template('offline.html')

@socketio.on('getStatusOfFavoriteDevicesTemp', namespace='/desktop')
def getStatusOfFavoriteDevicesTemp():
  data = domoticz.getStatusOfFavoriteDevicesTemp()
  emit('getTempDevice', {'data': json.dumps(data)})

@socketio.on('getStatusOfFavoriteDevicesLight', namespace='/desktop')
def getStatusOfFavoriteDevicesLight():
  data = domoticz.getStatusOfFavoriteDevicesLight()
  emit('getLightDevice', {'data': json.dumps(data)})

@socketio.on('updateStatusOfFavoriteDevicesTemp', namespace='/desktop')
def getStatusOfFavoriteDevicesTemp():
  data = domoticz.getStatusOfFavoriteDevicesTemp()
  emit('updateTempDevice', {'data': json.dumps(data)})

@socketio.on('updateStatusOfFavoriteDevicesLight', namespace='/desktop')
def getStatusOfFavoriteDevicesLight():
  data = domoticz.getStatusOfFavoriteDevicesLight()
  emit('updateLightDevice', {'data': json.dumps(data)})

@socketio.on('clickDeviceLight', namespace='/desktop')
def clickDeviceLight(data):
  domoticz.switchLight(int(data['idx']), True if data['state'] == 'On' else False)
  getStatusOfFavoriteDevicesLight() #send updated statuses

@socketio.on('changeDimmer', namespace='/desktop')
def changeDimmer(data):
  domoticz.changeDimmer(int(data['idx']), int(data['level']))
  getStatusOfFavoriteDevicesLight() #send updated statuses

@socketio.on('clickBlind', namespace='/desktop')
def clickBlind(data):
  domoticz.changeCover(int(data['idx']), str(data['state']))
  getStatusOfFavoriteDevicesLight() #send updated statuses

domoticz = domoticzCommunication.DomoticzCommuniucation()

if __name__ == '__main__':
  a = database.RemoteDatabase()
  socketio.run(app, host='0.0.0.0', port=81)