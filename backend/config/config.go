package config

import (
	"fmt"
	"os"
	
	"github.com/joho/godotenv"
)

func LoadConfig() error {
	err := godotenv.Load()
	if err != nil {
		return fmt.Errorf("erro ao carregar o arquivo .env: %w", err)
	}

	requiredEnvVars := []string{"DB_CONN", "TMDB_ACCESS_TOKEN"}
	for _, envVar := range requiredEnvVars {
		if os.Getenv(envVar) == "" {
			return fmt.Errorf("a variável de ambiente %s não está definida..", envVar)
		}
	}

	return nil
}