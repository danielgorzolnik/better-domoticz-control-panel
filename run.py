from flask import Flask, render_template, request, send_file, flash
from flask_socketio import SocketIO, emit
from flask_fontawesome import FontAwesome
import domoticzCommunication, database
import time, json

app = Flask(__name__)
socketio = SocketIO(app)
fa = FontAwesome(app)

localDatabase = database.LocalDatabase()
domoticz = domoticzCommunication.DomoticzCommuniucation(localDatabase)

@app.route('/')
def home():
  if domoticz.connectStatus:
    return render_template('desktop.html')
  else: 
    return render_template('offline.html')

@socketio.on('getStatusOfFavoriteDevicesTemp', namespace='/desktop')
def getStatusOfFavoriteDevicesTemp():
  data = domoticz.getStatusOfFavoriteDevicesTemp()
  emit('getTempDevice', {'data': json.dumps(data), 'order': localDatabase.getPositions("sensorRow")})

@socketio.on('getStatusOfFavoriteDevicesLight', namespace='/desktop')
def getStatusOfFavoriteDevicesLight():
  data = domoticz.getStatusOfFavoriteDevicesLight()
  emit('getLightDevice', {'data': json.dumps(data), 'order': localDatabase.getPositions("switchRow")})

@socketio.on('getFavoriteScenes', namespace='/desktop')
def getFavoriteScenes():
  data = domoticz.getFavoriteScenes()
  emit('getFavoriteScenes', {'data': json.dumps(data), 'order': localDatabase.getPositions("sceneRow")})

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

@socketio.on('widgetOrder', namespace='/desktop')
def widgetOrder(data):
  localDatabase.updatePositions("sensorRow", {"order": data["sensorRow"]})
  localDatabase.updatePositions("switchRow", {"order": data["switchRow"]})
  localDatabase.updatePositions("sceneRow", {"order": data["sceneRow"]})

@socketio.on('changeMovingMode', namespace='/desktop')
def widgetOrder(data):
  domoticz.changeMovingMode(data['value'])

@socketio.on('clickScene', namespace='/desktop')
def clickScene(data):
  domoticz.switchScene(int(data['idx']), True)
  getStatusOfFavoriteDevicesLight()

if __name__ == '__main__':
  a = domoticz.getFavoriteScenes()
  socketio.run(app, host='0.0.0.0', port=82)