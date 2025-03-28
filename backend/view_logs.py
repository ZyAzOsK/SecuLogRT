# used to check logs for testing purposes, the script prints all logs from the database.


import sqlite3

db_path = "security_events.db"

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute("SELECT * FROM security_events")
rows = cursor.fetchall()

for row in rows:
    print(row)

conn.close()
