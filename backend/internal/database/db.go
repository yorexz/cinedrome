package database

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/jackc/pgx/v4/stdlib"
)

func ConnectDB() (*sql.DB, error) {
	connStr := os.Getenv("DB_CONN")
	db, err := sql.Open("pgx", connStr)
	if err != nil {
		log.Fatalf("Erro ao conectar ao banco de dados: %v", err)
		return nil, err
	}
	
	if err = db.Ping(); err != nil {
		return nil, err
	}

	log.Println("Conectado ao banco de dados com sucesso!!")
	return db, nil
}
