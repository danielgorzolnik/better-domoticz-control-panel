from flask import Flask, render_template, request, send_file, flash
from flask_socketio import SocketIO, emit
from flask_fontawesome import FontAwesome
import domoticzCommunication, database
import time, json
import utils

app = Flask(__name__)
socketio = SocketIO(app)
fa = FontAwesome(app)

domoticz = domoticzCommunication.DomoticzCommuniucation()

#################### PAGE ROUTE ####################

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
      'favicon.ico', mimetype='image/vnd.microsoft.icon')

@app.route('/')
def home():
  if domoticz.checkConnection():
    return render_template('desktop.html')
  else: 
    return render_template('offline.html')

@app.route('/settings')
def settings():
  return render_template('settings.html')

#################### DESKTOP NAMESPACE ####################

@socketio.on('getStatusOfFavoriteDevicesTemp', namespace='/desktop')
def getStatusOfFavoriteDevicesTemp():
  data = domoticz.getStatusOfFavoriteDevicesTemp()
  localDatabase = database.LocalDatabase()
  emit('getTempDevice', {'data': json.dumps(data), 'order': localDatabase.getPositions("sensorRow")})
  localDatabase.close()

@socketio.on('getStatusOfFavoriteDevicesLight', namespace='/desktop')
def getStatusOfFavoriteDevicesLight():
  data = domoticz.getStatusOfFavoriteDevicesLight()
  localDatabase = database.LocalDatabase()
  emit('getLightDevice', {'data': json.dumps(data), 'order': localDatabase.getPositions("switchRow")})
  localDatabase.close()

@socketio.on('getFavoriteScenes', namespace='/desktop')
def getFavoriteScenes():
  localDatabase = database.LocalDatabase()
  data = domoticz.getFavoriteScenes()
  emit('getFavoriteScenes', {'data': json.dumps(data), 'order': localDatabase.getPositions("sceneRow")})
  localDatabase.close()

@socketio.on('updateStatusOfFavoriteDevicesTemp', namespace='/desktop')
def getStatusOfFavoriteDevicesTemp():
  data = domoticz.getStatusOfFavoriteDevicesTemp()
  emit('updateTempDevice', {'data': json.dumps(data)})

@socketio.on('updateStatusOfFavoriteDevicesLight', namespace='/desktop')
def getStatusOfFavoriteDevicesLight():
  data = domoticz.getStatusOfFavoriteDevicesLight()
  emit('updateLightDevice', {'data': json.dumps(data)})

@socketio.on('updateFavoriteScenes', namespace='/desktop')
def updateFavoriteScenes():
  data = domoticz.getFavoriteScenes()
  emit('updateScenes', {'data': json.dumps(data)})

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
  localDatabase = database.LocalDatabase()
  localDatabase.updatePositions("sensorRow", {"order": data["sensorRow"]})
  localDatabase.updatePositions("switchRow", {"order": data["switchRow"]})
  localDatabase.updatePositions("sceneRow", {"order": data["sceneRow"]})
  localDatabase.close()

@socketio.on('changeMovingMode', namespace='/desktop')
def widgetOrder(data):
  domoticz.changeMovingMode(data['value'])

@socketio.on('clickScene', namespace='/desktop')
def clickScene(data):
  domoticz.switchScene(int(data['idx']), True)
  updateFavoriteScenes()

@socketio.on('clickSelector', namespace='/desktop')
def clickSelector(data):
  domoticz.changeSelector(int(data['idx']), data['level'])
  getStatusOfFavoriteDevicesLight()

#################### SETTINGS NAMESPACE ####################

@socketio.on('getFullConfig', namespace='/settings')
def getFullConfig():
  localDatabse = database.LocalDatabase()
  allSettings = localDatabse.getFullConfig()
  emit('getFullConfig', {'data': json.dumps(allSettings)})

@socketio.on('sendConfig', namespace='/settings')
def getFullConfig(data):
  localDatabase = database.LocalDatabase()
  noHash = False
  if data['controller_password'] == 'HaHa! No way...':
    noHash = True
    data['controller_password'] = localDatabase.getConfig('controller_password')
  for configName in data:
    if configName == 'controller_password':
      if (noHash):
        localDatabase.updateConfig(configName, data[configName])
      else:
        localDatabase.updateConfig(configName, utils.hashText(data[configName]))
    else:
      localDatabase.updateConfig(configName, data[configName])
  localDatabase.close()
  domoticz.reloadConnection()


if __name__ == '__main__':
  socketio.run(app, host='0.0.0.0', port=82)