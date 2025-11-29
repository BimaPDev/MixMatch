import os
import psycopg2

class Database:
    def __init__(self):
        # We use os.getenv to keep credentials secure and flexible
        self.host = os.getenv('DB_HOST', 'localhost')
        self.user = os.getenv('DB_USER', 'user')
        self.password = os.getenv('DB_PASS', 'password')
        self.dbname = os.getenv('DB_NAME', 'wardrobe')
        self.port = os.getenv('DB_PORT', '5432')

    def get_connection(self):
        return psycopg2.connect(
            host=self.host,
            user=self.user,
            password=self.password,
            dbname=self.dbname,
            port=self.port
        )

    def update_item_status(self, item_id, category, color, confidence):
        try:
            conn = self.get_connection()
            cur = conn.cursor()
            
            # The query updates the status so the User can see it's done
            query = """
                UPDATE items 
                SET processing_status = 'completed',
                    category = %s,
                    color = %s,
                    confidence = %s
                WHERE id = %s
            """
            
            cur.execute(query, (category, color, confidence, item_id))
            conn.commit()
            
            cur.close()
            conn.close()
            print(f" [DB] Updated item {item_id}")
            return True
        except Exception as e:
            print(f" [!] Database Error: {e}")
            return False