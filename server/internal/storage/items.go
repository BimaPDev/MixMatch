package storage

import "time"

type DBItem struct {
	ID        string    `db:"id"`
	FilePath  string    `db:"file_path"`
	ThumbPath string    `db:"thumb_path"`
	CreatedAt time.Time `db:"created_at"`
}

func (s *Store) InsertItem(id, filePath, thumbPath string, created time.Time) error {
	_, err := s.DB.Exec(
		`INSERT INTO items(id,file_path,thumb_path,created_at) VALUES(?,?,?,?)`,
		id, filePath, thumbPath, created.UTC().Format(time.RFC3339Nano),
	)
	return err
}

func (s *Store) ListItems(limit, offset int) ([]DBItem, error) {
	rows := []DBItem{}
	err := s.DB.Select(&rows, `
SELECT id, file_path, thumb_path, datetime(created_at) as created_at
FROM items
ORDER BY created_at DESC
LIMIT ? OFFSET ?`, limit, offset)
	return rows, err
}

func (s *Store) GetItem(id string) (*DBItem, error) {
	var it DBItem
	err := s.DB.Get(&it, `
SELECT id, file_path, thumb_path, datetime(created_at) as created_at
FROM items WHERE id=?`, id)
	if err != nil { return nil, err }
	return &it, nil
}

func (s *Store) DeleteItem(id string) error {
	_, err := s.DB.Exec(`DELETE FROM items WHERE id=?`, id)
	return err
}
