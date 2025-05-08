package main

import (
	"database/sql"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"letterboxd-viewer-backend/config"
	"letterboxd-viewer-backend/internal/database"
	"letterboxd-viewer-backend/internal/handlers"
	"letterboxd-viewer-backend/internal/services"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func setupServer(db *sql.DB) *gin.Engine {
	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.New()

	router.Use(gin.Recovery())
	router.Use(gin.Logger())

	corsConfig := cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "https://futuro-dominio-checar-ainda!.com"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}
	router.Use(cors.New(corsConfig))

	logger := log.New(os.Stdout, "[API] ", log.LstdFlags)

	tmdbToken := os.Getenv("TMDB_ACCESS_TOKEN")
	if tmdbToken == "" {
		logger.Fatal("TMDB_ACCESS_TOKEN não configurado")
	}
	tmdbService := services.NewTMDBService(tmdbToken)

	movieHandler := handlers.NewMovieHandler(db, tmdbService, logger)
	movieHandler.SetupRoutes(router)

	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok",
			"time":   time.Now().Format(time.RFC3339),
		})
	})

	return router
}

func main() {
	logger := log.New(os.Stdout, "[Main] ", log.LstdFlags)

	if err := config.LoadConfig(); err != nil {
		logger.Fatalf("Erro ao carregar configurações: %v", err)
	}

	db, err := database.ConnectDB()
	if err != nil {
		logger.Fatalf("Erro ao conectar ao banco de dados: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		logger.Fatalf("Erro ao verificar conexão com o banco de dados: %v", err)
	}
	logger.Println("Conexão com o banco de dados estabelecida com sucesso")

	router := setupServer(db)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
		logger.Printf("Variável PORT não configurada, usando porta padrão: %s", port)
	}

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		addr := ":" + port
		logger.Printf("Servidor iniciando na porta %s...", port)
		if err := router.Run(addr); err != nil {
			logger.Fatalf("Erro ao iniciar o servidor: %v", err)
		}
	}()

	<-quit
	logger.Println("Servidor está encerrando...")

	logger.Println("Servidor encerrado com sucesso")
}
