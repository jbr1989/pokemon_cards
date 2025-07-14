import os
import sqlite3
import requests
import time

import libsql

url = os.getenv("TURSO_DATABASE_URL")
auth_token = os.getenv("TURSO_AUTH_TOKEN")

# Conecta o crea la base de datos SQLite
conn = sqlite3.connect("pokemon.db")
cursor = conn.cursor()

conn = libsql.connect("tcgbrowser", sync_url=url, auth_token=auth_token)
conn.sync()

# Crea la tabla si no existe
cursor.execute("""
    CREATE TABLE IF NOT EXISTS pokemon (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL
    )
""")

# Número máximo de Pokémon en la Pokédex Nacional
MAX_POKEMON = 1010  # puedes ajustar este número si hay más

# Llena la base de datos
for poke_id in range(1, MAX_POKEMON + 1):
    try:
        response = requests.get(f"https://pokeapi.co/api/v2/pokemon/{poke_id}")
        if response.status_code == 200:
            data = response.json()
            name = data["name"]
            cursor.execute("INSERT OR IGNORE INTO pokemon (id, name) VALUES (?, ?)", (poke_id, name))
            print(f"Insertado: {poke_id} - {name}")
        else:
            print(f"No encontrado: {poke_id}")
        time.sleep(0.25)  # Para no saturar la API pública
    except Exception as e:
        print(f"Error con {poke_id}: {e}")
        time.sleep(1)

# Guarda los cambios y cierra
conn.commit()
conn.close()
