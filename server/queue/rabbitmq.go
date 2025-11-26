package queue

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
	amqp "github.com/rabbitmq/amqp091-go"
)

// RabbitMQAdapter implements port.AIQueue
type RabbitMQAdapter struct {
	conn *amqp.Connection
	ch   *amqp.Channel
}

func NewRabbitMQAdapter(amqpURL string) (*RabbitMQAdapter, error) {
	// 1. Connect to RabbitMQ
	conn, err := amqp.Dial(amqpURL)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to rabbitmq: %w", err)
	}

	// 2. Open a Channel
	ch, err := conn.Channel()
	if err != nil {
		return nil, fmt.Errorf("failed to open channel: %w", err)
	}

	// 3. Declare the Queue (Idempotent: won't crash if it exists)
	_, err = ch.QueueDeclare(
		"image_processing_queue", // name
		true,                     // durable (save to disk)
		false,                    // delete when unused
		false,                    // exclusive
		false,                    // no-wait
		nil,                      // arguments
	)
	if err != nil {
		return nil, fmt.Errorf("failed to declare queue: %w", err)
	}

	return &RabbitMQAdapter{
		conn: conn,
		ch:   ch,
	}, nil
}

// Close cleans up connections (Call this in main.go on shutdown)
func (q *RabbitMQAdapter) Close() {
	q.ch.Close()
	q.conn.Close()
}

// PublishImageJob sends the message to the queue
func (q *RabbitMQAdapter) PublishImageJob(ctx context.Context, imageID uuid.UUID, imageURL string) error {
	// Define the payload structure
	payload := map[string]string{
		"image_id":  imageID.String(),
		"image_url": imageURL,
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("failed to marshal job: %w", err)
	}

	// Publish with a timeout context
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	return q.ch.PublishWithContext(ctx,
		"",                       // exchange
		"image_processing_queue", // routing key (queue name)
		false,                    // mandatory
		false,                    // immediate
		amqp.Publishing{
			DeliveryMode: amqp.Persistent, // CRITICAL: Save to disk
			ContentType:  "application/json",
			Body:         body,
		})
}
