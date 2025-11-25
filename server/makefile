docker:
	docker run --name simon -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=angela -p 5432:5432 -d postgres

migrateup:
	migrate -path db/migration -database "postgresql://root:secret@localhost:5433/mixmatch?sslmode=disable" -verbose up

migratedown:
	migrate -path db/migration -database "postgresql://root:secret@localhost:5433/mixmatch?sslmode=disable" -verbose down

gorun:
	go run cmd/api/main.go