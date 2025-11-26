import os
import pika
import json
import time
from pika.exceptions import AMQPConnectionError

# Use environment variables for configuration
# This allows it to work on your laptop OR in Docker
RABBITMQ_HOST = os.getenv('RABBITMQ_HOST', 'localhost')
RABBITMQ_USER = os.getenv('RABBITMQ_USER', 'user')
RABBITMQ_PASS = os.getenv('RABBITMQ_PASS', 'password')
QUEUE_NAME = 'image_processing_queue'

def connect():
    credentials = pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASS)
    parameters = pika.ConnectionParameters(host=RABBITMQ_HOST, port=5672, credentials=credentials)
    
    while True:
        try:
            connection = pika.BlockingConnection(parameters)
            print(f" [*] Connected to RabbitMQ at {RABBITMQ_HOST}")
            return connection
        except AMQPConnectionError: # <--- Use the direct name here
            print(" [-] RabbitMQ not ready, retrying in 5 seconds...")
            time.sleep(5)

def callback(ch, method, properties, body):
    print(f" [x] Received Job: {body}")
    
    # 1. Parse Data
    job = json.loads(body)
    image_id = job.get('image_id')
    image_url = job.get('image_url')

    # 2. SIMULATE AI WORK (Replace with PyTorch/OpenCV later)
    print(f" [AI] Processing image {image_id} from {image_url}...")
    time.sleep(3) # Pretend to think
    
    # 3. Update Database (Optional: You can add Postgres logic here later)
    # For now, we just print success
    print(f" [AI] Finished {image_id}")

    # 4. Acknowledge (Tell RabbitMQ we are done)
    ch.basic_ack(delivery_tag=method.delivery_tag)

if __name__ == '__main__':
    connection = connect()
    channel = connection.channel()
    
    # Make sure queue exists
    channel.queue_declare(queue=QUEUE_NAME, durable=True)
    
    # Only take 1 job at a time (Quality of Service)
    channel.basic_qos(prefetch_count=1)
    
    channel.basic_consume(queue=QUEUE_NAME, on_message_callback=callback)
    
    print(' [*] Waiting for messages. To exit press CTRL+C')
    channel.start_consuming()