import os
import pika
import json
import time
import psycopg2
from pika.exceptions import AMQPConnectionError

# RabbitMQ Config
RABBITMQ_HOST = os.getenv('RABBITMQ_HOST', 'localhost')
RABBITMQ_USER = os.getenv('RABBITMQ_USER', 'user')
RABBITMQ_PASS = os.getenv('RABBITMQ_PASS', 'password')
QUEUE_NAME = 'image_processing_queue'

# Database Config
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_USER = os.getenv('DB_USER', 'user')
DB_PASS = os.getenv('DB_PASS', 'password')
DB_NAME = os.getenv('DB_NAME', 'Simon')

def get_db_connection():
    return psycopg2.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASS,
        dbname=DB_NAME
    )

def connect():
    credentials = pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASS)
    parameters = pika.ConnectionParameters(host=RABBITMQ_HOST, port=5672, credentials=credentials)
    
    while True:
        try:
            connection = pika.BlockingConnection(parameters)
            print(f" [*] Connected to RabbitMQ at {RABBITMQ_HOST}")
            return connection
        except AMQPConnectionError:
            print(" [-] RabbitMQ not ready, retrying in 5 seconds...")
            time.sleep(5)

def callback(ch, method, properties, body):
    print(f" [x] Received Job: {body}")
    
    try:
        job = json.loads(body)
        image_id = job.get('image_id')
        
        # 1. SIMULATE AI WORK
        print(f" [AI] Processing {image_id}...")
        time.sleep(2) 
        
        # Mock Results
        detected_category = "t-shirt"
        detected_color = "red"
        confidence_score = 0.98

        # 2. UPDATE DATABASE
        conn = get_db_connection()
        cur = conn.cursor()
        
        query = """
            UPDATE items 
            SET processing_status = 'completed',
                category = %s,
                color = %s,
                confidence = %s
            WHERE id = %s
        """
        
        cur.execute(query, (detected_category, detected_color, confidence_score, image_id))
        conn.commit()
        
        cur.close()
        conn.close()
        print(f" [DB] Updated item {image_id} to 'completed'")

        # 3. ACKNOWLEDGE message only after success
        ch.basic_ack(delivery_tag=method.delivery_tag)
        
    except Exception as e:
        print(f" [!] Error processing job: {e}")
        # In a real app, we might reject the message so it retries, 
        # but for now we just log it.

if __name__ == '__main__':
    connection = connect()
    channel = connection.channel()
    
    channel.queue_declare(queue=QUEUE_NAME, durable=True)
    channel.basic_qos(prefetch_count=1)
    
    channel.basic_consume(queue=QUEUE_NAME, on_message_callback=callback)
    
    print(' [*] Waiting for messages. To exit press CTRL+C')
    channel.start_consuming()