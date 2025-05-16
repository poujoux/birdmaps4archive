import sqlite3
from threading import Lock

lock = Lock()

class DbSet:
    def __init__(self, databasename, tablename):
        self.dn = databasename
        self._tn = tablename
        self.db, self.dbc = self._tablesetter()


    def close():
        self.db.close()
        print("It has been closed")


    @property
    def tn(self):
        return self._tn


    def _tablesetter(self):

        tep = sqlite3.connect(f"{self.dn}", check_same_thread=False)
        tepc = tep.cursor()

        #tepc.execute("DROP TABLE IF EXISTS Mytable3")

        tepc.execute(f"""
                     CREATE TABLE IF NOT EXISTS {self._tn} (
                         ItemName TEXT PRIMARY KEY NOT NULL,
                         ImgLink TEXT,
                         MapLink TEXT,
                         RoadWay TEXT
                         )
                     """)


        return tep, tepc



    def searchf(self, name):

        #lock.acquire(True)

        self.dbc = self.db.cursor()

        try:
            self.dbc.execute(f"SELECT * FROM {self._tn} WHERE ItemName = ? ORDER BY ItemName", (str(name),))

            fnd = self.dbc.fetchone()
            if fnd:
                print("Search: ", fnd)
                self.dbc.close()
                print("whthhhhhhhh")
                return fnd
            else:
                print("Search: ", "Not foundd") 
                self.dbc.close()

        except sqlite3.OperationalError as e:
            print("An error occurred: ", e)
        
        self.dbc.close()


        #lock.release()


    def addf(self, name, imglink, maplink, roadway):
        
        #lock.acquire(True)
        self.dbc = self.db.cursor()
        try:
            self.dbc.execute(f"INSERT INTO {self._tn} VALUES (?, ?, ?, ?)", (name, imglink, maplink, roadway))
            self.db.commit()

        except Exception as e:
            print("An error occured: ", e)

        self.dbc.close()

        #lock.release()



    def delf(self, name):
        self.dbc = self.db.cursor()
        try:
            self.dbc.execute(f"DELETE FROM {self._tn} WHERE ItemName = ?", (name,))
            print("It has been deleted")
        
        except Exception as e:
            print("An error occured: ", e)

        self.dbc.close()













