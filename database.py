import mysql.connector
import json

class RemoteDatabase:
    def __init__(self):
        if self.open():
            self.__create_tables()

    def open(self):
        try:
            dbConfig = json.loads(open('config.json', 'r').read())['mysql']
            self.database = mysql.connector.connect(
                host = dbConfig['hostname'],
                user = dbConfig['username'],
                password = dbConfig['password'],
                port = dbConfig['port'],
                database = dbConfig['database']
            )
            self.cursor = self.database.cursor()
            return True

        except Exception as e:
            print(e)
            return False

    def close(self):
        pass

    def __create_tables(self):
        query = """
            CREATE TABLE IF NOT EXISTS positions (
                id int NOT NULL AUTO_INCREMENT,
                position varchar(30) NOT NULL,
                idx int NOT NULL,
                PRIMARY KEY (id)
            )
        """
        self.cursor.execute(query)
        query = """
            CREATE TABLE IF NOT EXISTS settings (
                id int NOT NULL AUTO_INCREMENT,
                rule varchar(30) NOT NULL,
                value varchar(30) NOT NULL,
                PRIMARY KEY (id)
            )
        """
        self.cursor.execute(query)
        self.database.commit()