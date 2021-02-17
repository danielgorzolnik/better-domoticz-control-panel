import sqlite3
import json

class LocalDatabase:
    __databaseFile = "database/database.db"
    def __init__(self):
        if self.open():
            self.__create_tables()
            self.__insert_default_config()

    def open(self):
        try:
            self.database = sqlite3.connect(self.__databaseFile)
            self.cursor = self.database.cursor()
            return True

        except Exception as e:
            print(e)
            return False

    def close(self):
        self.database.close()

    def getPositions(self, positionType):
        try:
            query = f"""
                SELECT id, order_value 
                FROM positions 
                WHERE type="{positionType}" 
            """
            self.cursor.execute(query)
            rawData = self.cursor.fetchone()
            return json.loads(rawData[1])["order"]
        except Exception as e:
            print (e)
            return None

    def insertPositions(self, positionType, orderValue):
        query = f"""
            INSERT INTO positions(type, order_value)
            VALUES('{positionType}', '{json.dumps(orderValue)}') 
        """
        self.cursor.execute(query)
        self.database.commit()

    def updatePositions(self, positionType, orderValue):
        query = f"""
            UPDATE positions SET
            order_value = '{json.dumps(orderValue)}'
            WHERE type = '{positionType}'
        """
        self.cursor.execute(query)
        self.database.commit()

    def getConfig(self, name){
        query = f"""
            SELECT value FROM settings WHERE name="{name}"
        """
        self.cursor.execute(query)
        rawData = self.cursor.fetchone()
        if rawData[0]:
            return rawData[0]
        else:
            return None
    }

    def updateConfig(self, name, value)[
        try:
            query=f"""
                UPDATE settings SET value='{value}' WHERE name='{name}'
            """
            self.cursor.execute(query)
            self.database.commit()
            return True
        except Exception as e:
            print(e)
            return False
    ]

    def __is_config(self, name):
        try:
            query = f"""
                SELECT value FROM settings WHERE name="{name}"
            """
            self.cursor.execute(query)
            rawData = self.cursor.fetchone()
            if rawData[0]:
                return True
            else:
                return False
        except Exception as e:
            print(e)
            return False

    def __insert_default_config(self):
        default_config = [
            ['controller_ip', '0.0.0.0'],
            ['controller_port', '8080'],
            ['controller_username', 'username'],
            ['controller_password', 'password'],
            ['panel_port', '80']
        ]
        for config in default_config:
            if not self.__is_config(config[0]):
                query = f"""
                    INSERT INTO settings(name, value) VALUES('{config[0]}', '{config[1]}')
                """
                self.cursor.execute(query)
        self.database.commit()

    def __create_tables(self):
        query = """
            CREATE TABLE IF NOT EXISTS positions(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                type TEXT NOT NULL,
                order_value TEXT NOT NULL
            )
        """
        self.cursor.execute(query)
        query = """
            CREATE TABLE IF NOT EXISTS settings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                value TEXT NOT NULL
            )
        """
        self.cursor.execute(query)
        self.database.commit()