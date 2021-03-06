import HTTPconnector
import json, base64
import database

class DomoticzCommuniucation:
  movingMode = False #if true, dont send click events to domoticz
  def __init__(self):
    try:
      self.connector = HTTPconnector.Connector()
      if self.connector.connectStatus:
        self.__checkDatabaseOrder()
    except Exception as e:
      print(e)

  def __checkDatabaseOrder(self):
    localDatabase = database.LocalDatabase()
    if localDatabase.getPositions("switchRow") == None:
      idList = []
      for device in (self.getStatusOfFavoriteDevicesLight()):
        idList.append(device["idx"])
      orderValue = {"order": idList}
      localDatabase.insertPositions("switchRow", orderValue)

    if localDatabase.getPositions("sensorRow") == None:
      idList = []
      for device in (self.getStatusOfFavoriteDevicesTemp()):
        idList.append(device["idx"])
      orderValue = {"order": idList}
      localDatabase.insertPositions("sensorRow", orderValue)

    if localDatabase.getPositions("sceneRow") == None:
      idList = []
      for device in (self.getFavoriteScenes()):
        idList.append(device["idx"])
      orderValue = {"order": idList}
      localDatabase.insertPositions("sceneRow", orderValue)

    if localDatabase.getPositions("weatherRow") == None:
      idList = []
      for device in (self.getOfFavoriteDevicesWeather()):
        idList.append(device["idx"])
      orderValue = {"order": idList}
      localDatabase.insertPositions("weatherRow", orderValue)

  def __searchInDatabase(self, idx, positionType):
    try:
      localDatabase = database.LocalDatabase()
      positions = localDatabase.getPositions(positionType)
      found = False
      for position in positions:
        if position == idx:
          found = True
          break
      return found
    except Exception as e:
      print(e)
      return True
    
  def reloadConnection(self):
    self.connector.reloadConnectionParams()
    self.__checkDatabaseOrder()

  def checkConnection(self):
    return self.connector.connectStatus

  def changeMovingMode(self, value):
    self.movingMode = value

  def getStatusOfFavoriteDevicesLight(self):
    data = self.connector.sendAndReceiveData('type=devices&used=true&filter=light&favorite=1')
    if data == False: return False
    else: 
      output = []
      for device in data['result']:
        try:
          localDatabase = database.LocalDatabase()
          if device["Name"]: #filter devices only with name
            tmpJson = { 
              "Name": device["Name"],
              "idx": device["idx"],
              "Status": device["Status"],
              "SwitchType": device["SwitchType"],
              "Level": device["Level"],
              "DimmerType": device["DimmerType"],
              "LastUpdate": device["LastUpdate"],
              "Image": device["Image"]
              }
            if device["SwitchType"] == "Selector": tmpJson["LevelNames"] = base64.b64decode(device["LevelNames"].encode("utf-8")).decode("utf-8").split("|")
            if not self.__searchInDatabase(tmpJson["idx"], "switchRow"):
              positions = localDatabase.getPositions("switchRow")
              positions.append(tmpJson["idx"])
              localDatabase.updatePositions("switchRow", {"order": positions})
            output.append(tmpJson) #append only specyfic values
        except Exception as e: print (e)
      return output

  def getStatusOfFavoriteDevicesTemp(self):
    data = self.connector.sendAndReceiveData('type=devices&used=true&filter=temp&favorite=1')
    if data == False: return False
    else: 
      output = []
      for device in data['result']:
        try:
          localDatabase = database.LocalDatabase()
          output.append({
              "Name": device["Name"],
              "idx": device["idx"],
              "Data": device["Data"],
              "Type": device["Type"],
              "LastUpdate": device["LastUpdate"],
              "TypeImg": device["TypeImg"]
            })
          if not self.__searchInDatabase(device["idx"], "sensorRow"):
            positions = localDatabase.getPositions("sensorRow")
            positions.append(device["idx"])
            localDatabase.updatePositions("sensorRow", {"order": positions})
        except Exception as e: print (e)
      return output

  def getFavoriteScenes(self):
    data = self.connector.sendAndReceiveData('type=scenes&favorite=1')
    if data == False: return False
    else:
      localDatabase = database.LocalDatabase()
      output = []
      try:
        for scene in data['result']:
          output.append({
            "Name": scene["Name"],
            "idx": scene["idx"],
            "Type": scene["Type"],
            "LastUpdate": scene["LastUpdate"],
            "Image": "Scene"
          })
          if not self.__searchInDatabase(scene["idx"], "sceneRow"):
            positions = localDatabase.getPositions("sceneRow")
            positions.append(scene["idx"])
            localDatabase.updatePositions("sceneRow", {"order": positions})
      except:
        pass
      return output

  def getOfFavoriteDevicesWeather(self):
    data = self.connector.sendAndReceiveData('type=devices&filter=wind&used=true&order=Name&favorite=1')
    if data == False: return False
    else:
      localDatabase = database.LocalDatabase
      output = []
      try:
        for sensor in data['result']:
          output.append({
            "Name": sensor["Name"],
            "idx": sensor["idx"],
            "Type": sensor["Type"],
            "LastUpdate": sensor["LastUpdate"],
            "TypeImg": sensor["TypeImg"],
            "Speed": sensor["Speed"],
            "Direction": sensor["DirectionStr"],
            "Gust": sensor["Gust"]
          })
          if not self.__searchInDatabase(sensor["idx"], "weatherRow"):
            positions = localDatabase.getPositions("weatherRow")
            positions.append(sensor["idx"])
            localDatabase.updatePositions("weatherRow", {"order": positions})
      except Exception as e:
        print(e)
      return output

  def switchScene(self, idx, state):
    if not self.movingMode:
      if state: state = 'On'
      else: state = 'Off'
      url = 'type=command&param=switchscene&idx=%s&switchcmd=%s' % (idx,  state)
      data = self.connector.sendAndReceiveData(url)
      if data: return True
      else: return False
    else:
      return True

  def switchLight(self, idx, state):
    if not self.movingMode:
      if state: state = 'On'
      else: state = 'Off'
      url = 'type=command&param=switchlight&idx=%d&switchcmd=%s' % (idx, state)
      data = self.connector.sendAndReceiveData(url)
      if data: return True
      else: return False
    else:
      return True

  def toggleLight(self, idx):
    if not self.movingMode:
      url = 'type=command&param=switchlight&idx=%d&switchcmd=Toggle' % idx
      data = self.connector.sendAndReceiveData(url)
      if data: return True
      else: return False
    else:
      return True

  def changeDimmer(self, idx, value):
    if not self.movingMode:
      url = 'type=command&param=switchlight&idx=%d&switchcmd=Set Level&level=%d' % (idx, value)
      url = url.replace(' ', '%20')
      data = self.connector.sendAndReceiveData(url)
      if data: return True
      else: return False
    else:
      return True

  def changeCover(self, idx, state):
    if not self.movingMode:
      if state == 'up': state = 'Off'
      elif state == 'stop': state = 'Stop'
      elif state == 'down': state = 'On'
      url = 'type=command&param=switchlight&idx=%d&switchcmd=%s' % (idx, state)
      data = self.connector.sendAndReceiveData(url)
      if data: return True
      else: return False
    else:
      return True

  def changeSelector(self, idx, level):
    if not self.movingMode:
      data = self.getStatusOfFavoriteDevicesLight()
      device = None
      for dev in data:
        if dev['idx'] == str(idx):
          device = dev
          break
      if device:
        levelId = -1
        for levelName in enumerate(device['LevelNames']):
          if levelName[1] == level:
            levelId = levelName[0]
        if levelId >= 0:
          url = f'type=command&param=switchlight&idx={str(idx)}&switchcmd=Set%20Level&level={str(levelId)}'
          data = self.connector.sendAndReceiveData(url)
          if data: return True
          else: return False
        else: return False
      else: return False
    else:
      return True