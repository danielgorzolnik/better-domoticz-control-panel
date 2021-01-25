import sqlite3
import json

class LocalDatabase:
    __databaseFile = "database/database.db"
    def __init__(self):
        if self.open():
            self.__create_tables()

    def open(self):
        try:
            self.database = sqlite3.connect(self.__databaseFile)
            self.cursor = self.database.cursor()
            return True

        except Exception as e:
            print(e)
            return False

    def close(self):
        pass

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