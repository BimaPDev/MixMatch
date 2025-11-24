package handlers

import (
	"database/sql"
)

// intoNullString converts a string to a SQL NullString
func intoNullString(s string) sql.NullString {
	if s == "" {
		return sql.NullString{String: "", Valid: false}
	}
	return sql.NullString{String: s, Valid: true}
}
