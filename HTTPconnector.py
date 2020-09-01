import json
import base64
import requests

class Connector:
  connectStatus = False
  def __init__(self):
    try:
      domoticzConfig = json.loads(open('config.json', 'r').read())['domoticz']
      self.username = bytearray()
      self.username.extend(map(ord, domoticzConfig['username'])) #keep username encrypted in base64
      self.username = base64.b64encode(self.username).decode()
      self.password = bytearray()
      self.password.extend(map(ord, domoticzConfig['password']))
      self.password = base64.b64encode(self.password).decode() #keep password encrypted in base64
      self.ip = domoticzConfig['ip']
      self.port = domoticzConfig['port']
      self.connectStatus = True
    except Exception as e:
      print(e)

  def sendAndReceiveData(self, data):
    url = self.__prepareUrl(data)
    response = requests.get(url)
    if response.status_code == 200:
      responseText = json.loads(response.text)
      if responseText['status'] == 'OK':
        return responseText
      else:
        return False
    else:
      return False

  def __prepareUrl(self, additional):
    url = 'http://' + self.ip + ':' + str(self.port) + '/json.htm?username=' + self.username + '&password=' + self.password + '&' #base of the url
    url += str(additional)
    return url