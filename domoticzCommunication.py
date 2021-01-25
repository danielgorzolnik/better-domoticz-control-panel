import HTTPconnector
import json, base64

class DomoticzCommuniucation:
  connectStatus = False
  movingMode = False #if true, dont send click events to domoticz
  __localDatabase = None
  def __init__(self, database):
    try:
      self.connector = HTTPconnector.Connector()
      if self.connector.connectStatus:
        if self.checkingConnection():
          self.connectStatus = True
          self.__localDatabase = database
          self.__checkDatabaseOrder()
    except Exception as e:
      print(e)

  def __checkDatabaseOrder(self):
    if self.__localDatabase.getPositions("switchRow") == None:
      idList = []
      for device in (self.getStatusOfFavoriteDevicesLight()):
        idList.append(device["idx"])
      orderValue = {"order": idList}
      self.__localDatabase.insertPositions("switchRow", orderValue)

    if self.__localDatabase.getPositions("sensorRow") == None:
      idList = []
      for device in (self.getStatusOfFavoriteDevicesTemp()):
        idList.append(device["idx"])
      orderValue = {"order": idList}
      self.__localDatabase.insertPositions("sensorRow", orderValue)

    if self.__localDatabase.getPositions("sceneRow") == None:
      idList = []
      for device in (self.getFavoriteScenes()):
        idList.append(device["idx"])
      orderValue = {"order": idList}
      self.__localDatabase.insertPositions("sceneRow", orderValue)

  def __searchInDatabase(self, idx, positionType):
    try:
      positions = self.__localDatabase.getPositions(positionType)
      found = False
      for position in positions:
        if position == idx:
          found = True
          break
      return found
    except Exception as e:
      print(e)
      return True
    
  def changeMovingMode(self, value):
    self.movingMode = value

  def checkingConnection(self): #checking communication with domoticz
    data = self.connector.sendAndReceiveData('type=command&param=getversion')
    if data == False: return False
    else: return True

  def getStatusOfFavoriteDevicesLight(self):
    data = self.connector.sendAndReceiveData('type=devices&used=true&filter=light&favorite=1')
    if data == False: return False
    else: 
      output = []
      for device in data['result']:
        try:
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
              positions = self.__localDatabase.getPositions("switchRow")
              positions.append(tmpJson["idx"])
              self.__localDatabase.updatePositions("switchRow", {"order": positions})
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
          output.append({
              "Name": device["Name"],
              "idx": device["idx"],
              "Data": device["Data"],
              "Type": device["Type"],
              "LastUpdate": device["LastUpdate"],
              "TypeImg": device["TypeImg"]
            })
          if not self.__searchInDatabase(device["idx"], "sensorRow"):
            positions = self.__localDatabase.getPositions("sensorRow")
            positions.append(device["idx"])
            self.__localDatabase.updatePositions("sensorRow", {"order": positions})
        except Exception as e: print (e)
      return output

  def getFavoriteScenes(self):
    data = self.connector.sendAndReceiveData('type=scenes&favorite=1')
    if data == False: return False
    else:
      output = []
      for scene in data['result']:
        output.append({
          "Name": scene["Name"],
          "idx": scene["idx"],
          "Type": scene["Type"],
          "LastUpdate": scene["LastUpdate"],
          "Image": "Scene"
        })
        if not self.__searchInDatabase(scene["idx"], "sceneRow"):
          positions = self.__localDatabase.getPositions("sceneRow")
          positions.append(scene["idx"])
          self.__localDatabase.updatePositions("sceneRow", {"order": positions})
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
    if self.movingMode:
      if state == 'up': state = 'Off'
      elif state == 'stop': state = 'Stop'
      elif state == 'down': state = 'On'
      url = 'type=command&param=switchlight&idx=%d&switchcmd=%s' % (idx, state)
      data = self.connector.sendAndReceiveData(url)
      if data: return True
      else: return False
    else:
      return True
