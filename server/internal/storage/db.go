package storage

import (
	"github.com/jmoiron/sqlx"
	_ "modernc.org/sqlite"
)

type Store struct{ DB *sqlx.DB }

func Open(path string) (*Store, error) {
	db, err := sqlx.Open("sqlite", path)
	if err != nil { return nil, err }
	s := &Store{DB: db}
	return s, s.migrate()
}

func (s *Store) migrate() error {
	_, err := s.DB.Exec(`
CREATE TABLE IF NOT EXISTS items (
  id TEXT PRIMARY KEY,
  file_path  TEXT NOT NULL,
  thumb_path TEXT NOT NULL,
  created_at TEXT NOT NULL
);`)
	return err
}
