docker:
	docker run --name simon -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=angela -p 5432:5432 -d postgres

migrateup:
	migrate -path db/migration -database "postgresql://user:password@localhost:5433/MixMatch?sslmode=disable" -verbose up

migratedown:
	migrate -path db/migration -database "postgresql://root:secret@localhost:5433/mixmatch?sslmode=disable" -verbose down

gorun:
	go run cmd/api/main.go

testuser:
	docker exec -it Simon psql -U user -d MixMatch -c "INSERT INTO users (id, email, password_hash) VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'test@example.com', 'hash');"