import sqlite3


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
        tep = sqlite3.connect(f"{self.dn}")
        tepc = tep.cursor()

        #tepc.execute("DROP TABLE IF EXISTS Mytable3")

        tepc.execute(f"""
                     CREATE TABLE IF NOT EXISTS {self.tn} (
                         ItemName TEXT PRIMARY KEY NOT NULL,
                         ImgLink TEXT,
                         MapLink TEXT,
                         RoadWay TEXT
                         )
                     """)
        return tep, tepc



    def addf(self, name, imglink, maplink, roadway):
        try:
            self.dbc.execute(f"INSERT INTO {self.tn} VALUES (?, ?, ?, ?)", (name, imglink, maplink, roadway))
            self.db.commit()

        except Exception as e:
            print("An error occured: ", e)



    def searchf(self, name):

        try:
            self.dbc.execute(f"SELECT * FROM {self.tn} WHERE ItemName = ? ORDER BY ItemName", (str(name),))

            fnd = self.dbc.fetchone()
            if fnd:
                print("Search: ", fnd)
                return fnd
            else:
                print("Search: ", "Not foundd") 

        except sqlite3.OperationalError as e:
            print("An error occurred: ", e)


    def delf(self, name):
        try:
            self.dbc.execute(f"DELETE FROM {self.tn} WHERE ItemName = ?", (name,))
            print("It has been deleted")
        
        except Exception as e:
            print("An error occured: ", e)











