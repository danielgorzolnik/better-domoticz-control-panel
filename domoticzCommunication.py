import HTTPconnector
import json, base64

class DomoticzCommuniucation:
  connectStatus = False
  def __init__(self):
    try:
      self.connector = HTTPconnector.Connector()
      if self.connector.connectStatus:
        if self.checkingConnection():
          self.connectStatus = True
    except Exception as e:
      print(e)

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
        except: pass
      return output

  def switchLight(self, idx, state):
    if state: state = 'On'
    else: state = 'Off'
    url = 'type=command&param=switchlight&idx=%d&switchcmd=%s' % (idx, state)
    data = self.connector.sendAndReceiveData(url)
    if data: return True
    else: return False

  def toggleLight(self, idx):
    url = 'type=command&param=switchlight&idx=%d&switchcmd=Toggle' % idx
    data = self.connector.sendAndReceiveData(url)
    if data: return True
    else: return False

  def changeDimmer(self, idx, value):
    url = 'type=command&param=switchlight&idx=%d&switchcmd=Set Level&level=%d' % (idx, value)
    url = url.replace(' ', '%20')
    data = self.connector.sendAndReceiveData(url)
    if data: return True
    else: return False

  def changeCover(self, idx, state):
    print(state)
    if state == 'up': state = 'Off'
    elif state == 'stop': state = 'Stop'
    elif state == 'down': state = 'On'
    url = 'type=command&param=switchlight&idx=%d&switchcmd=%s' % (idx, state)
    data = self.connector.sendAndReceiveData(url)
    if data: return True
    else: return False
