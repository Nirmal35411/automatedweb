import aiosqlite, json, time
DB = "state.db"

async def init_db():
    async with aiosqlite.connect(DB) as db:
        await db.execute('''
            CREATE TABLE IF NOT EXISTS checkpoints (
                id INTEGER PRIMARY KEY,
                ts REAL,
                label TEXT,
                state_json TEXT
            )
        ''')
        await db.commit()

async def save_checkpoint(label: str, state: dict):
    async with aiosqlite.connect(DB) as db:
        await db.execute("INSERT INTO checkpoints (ts, label, state_json) VALUES (?, ?, ?)",
                         (time.time(), label, json.dumps(state)))
        await db.commit()
