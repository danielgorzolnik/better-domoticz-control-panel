import json
import requests
import utils
import database
import threading
import time

class Connector:
  connectStatus = False
  username = ''
  password = ''
  ip = ''
  port = 0

  def __init__(self):
    try:
      domoticzConfig = json.loads(open('config.json', 'r').read())['domoticz']
      self.reloadConnectionParams()
      self.connectStatus = self.__checkConnection()
      if (not self.connectStatus):
        threading.Thread(target=self.__checkConnectionThread).start()
      else:
        threading.Thread(target=self.__checkIsConnectedThread).start()
    except Exception as e:
      print(e)

  def reloadConnectionParams(self):
      localDatabase = database.LocalDatabase()
      self.username = utils.hashText(localDatabase.getConfig('controller_username'))
      self.password = localDatabase.getConfig('controller_password')
      self.ip = localDatabase.getConfig('controller_ip')
      self.port = int(localDatabase.getConfig('controller_port'))
      localDatabase.close()

  def sendAndReceiveData(self, data):
    try:
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
    except Exception as e:
      print(e)
      return False

  def __checkConnectionThread(self):
    while not self.connectStatus:
      print("Cant connect to controller!")
      self.reloadConnectionParams()
      self.connectStatus = self.__checkConnection()
      if not self.connectStatus: time.sleep(2)
      else: break
    if self.connectStatus:
      threading.Thread(target=self.__checkIsConnectedThread).start()

  def __checkIsConnectedThread(self):
    errorCount = 0
    while self.connectStatus:
      if not self.__checkConnection():
        errorCount += 1
        if errorCount > 3:
          self.connectStatus = False
          break
      else:
        if errorCount > 0:
          errorCount = 0
      time.sleep(5)
    if not self.connectStatus:
      threading.Thread(target=self.__checkConnectionThread).start()

  def __checkConnection(self):
    url = self.__prepareUrl('type=command&param=getversion')
    return self.sendAndReceiveData(url)

  def __prepareUrl(self, additional = None):
    url = 'http://' + self.ip + ':' + str(self.port) + '/json.htm?username=' + self.username + '&password=' + self.password + '&' #base of the url
    if additional:
      url += str(additional)
    return url