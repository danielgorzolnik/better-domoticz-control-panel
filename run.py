from flask import Flask, render_template, request, send_file, flash
from flask_socketio import SocketIO, emit
from flask_fontawesome import FontAwesome
import domoticzCommunication
import time, json

app = Flask(__name__)
socketio = SocketIO(app)
fa = FontAwesome(app)

domoticz = domoticzCommunication.DomoticzCommuniucation()

@app.route('/')
def home():
  if domoticz.connectStatus:
    return render_template('desktop.html')
  else: 
    return render_template('offline.html')

@socketio.on('getStatusOfFavoriteDevicesLight', namespace='/desktop')
def getStatusOfFavoriteDevicesLight():
  data = domoticz.getStatusOfFavoriteDevicesLight()
  emit('getLightDevice', {'data': json.dumps(data)})

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
  print(data)
  domoticz.changeDimmer(int(data['idx']), int(data['level']))
  getStatusOfFavoriteDevicesLight() #send updated statuses

if __name__ == '__main__':
  socketio.run(app, host='0.0.0.0', port=81)