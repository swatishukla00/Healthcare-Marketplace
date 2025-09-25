import sqlite3

def init_db():
    conn = sqlite3.connect('data_catalog.db')
    c = conn.cursor()
    c.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    c.execute('''
    CREATE TABLE IF NOT EXISTS datasets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        provider TEXT NOT NULL,
        price REAL NOT NULL,
        category TEXT,
        format TEXT,
        listing_date DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    c.execute('''
    CREATE TABLE IF NOT EXISTS providers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        type TEXT,
        location TEXT
    )
    ''')
    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
