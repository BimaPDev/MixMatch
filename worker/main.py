import os
import pika
import json
import time
from pika.exceptions import AMQPConnectionError

from services.database import Database
from services.processor import ImageProcessor

RABBITMQ_HOST = os.getenv('RABBITMQ_HOST', 'localhost')
RABBITMQ_USER = os.getenv('RABBITMQ_USER', 'user')
RABBITMQ_PASS = os.getenv('RABBITMQ_PASS', 'password')
QUEUE_NAME = 'image_processing_queue'

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
        
        # DEBUG LOG 1
        print(f" [DEBUG] Step 1 - Image ID: {image_id}")
        
        original_filename = image_url.split('/')[-1]
        
        # 2. ANALYZE
        result = ai.analyze(image_url, original_filename)
        
        # DEBUG LOG 2: Check if 'processed_url' exists inside result
        print(f" [DEBUG] Step 2 - AI Finished. Result keys: {list(result.keys())}")
        print(f" [DEBUG] Step 2 - Processed URL value: '{result.get('processed_url')}'")

        # 3. UPDATE DB
        # We explicitly print what we are about to send to the DB
        p_url = result.get('processed_url')
        print(f" [DEBUG] Step 3 - Sending to DB: processed_url='{p_url}'")
        
        success = db.update_item_status(
            image_id, 
            result['category'], 
            result['color'], 
            result['confidence'],
            p_url 
        )

        if success:
            print(" [DEBUG] Step 4 - DB Update returned True")
            ch.basic_ack(delivery_tag=method.delivery_tag)
        else:
            print(" [DEBUG] Step 4 - DB Update returned False")
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