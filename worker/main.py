import os
import pika
import json
import time
from pika.exceptions import AMQPConnectionError

# NEW IMPORTS: Importing from your services folder
from services.database import Database
from services.processor import ImageProcessor

# Initialize Config
RABBITMQ_HOST = os.getenv('RABBITMQ_HOST', 'localhost')
RABBITMQ_USER = os.getenv('RABBITMQ_USER', 'user')
RABBITMQ_PASS = os.getenv('RABBITMQ_PASS', 'password')
QUEUE_NAME = 'image_processing_queue'

# Initialize the classes
db = Database()
ai = ImageProcessor()

def connect_to_mq():
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
        image_url = job.get('image_url')

        # EXTRACT FILENAME from URL
        # URL: http://.../static/uuid.jpg  ->  Filename: uuid.jpg
        original_filename = image_url.split('/')[-1]

        # 1. Use the AI Service (Pass filename too!)
        result = ai.analyze(image_url, original_filename)
        print(f" [AI] Result: {result}")

        # 2. Use the DB Service
        # Note: You should ideally save result['processed_url'] to the DB here
        success = db.update_item_status(
            image_id, 
            result['category'], 
            result['color'], 
            result['confidence'],
            result['processed_url'] # <--- Pass this new value
        )

        # 3. Acknowledge the message
        if success:
            ch.basic_ack(delivery_tag=method.delivery_tag)
        else:
            # If DB failed, we still ack to prevent infinite loops in this demo.
            # In production, you might send this to a "Dead Letter Queue".
            print(" [!] DB Update failed")
            ch.basic_ack(delivery_tag=method.delivery_tag)
        
    except Exception as e:
        print(f" [!] Critical Error: {e}")
        ch.basic_ack(delivery_tag=method.delivery_tag)

if __name__ == '__main__':
    connection = connect_to_mq()
    channel = connection.channel()
    
    channel.queue_declare(queue=QUEUE_NAME, durable=True)
    channel.basic_qos(prefetch_count=1)
    
    channel.basic_consume(queue=QUEUE_NAME, on_message_callback=callback)
    
    print(' [*] Worker Started. Waiting for messages...')
    channel.start_consuming()