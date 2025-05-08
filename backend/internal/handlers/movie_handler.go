package handlers

import (
	"database/sql"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"letterboxd-viewer-backend/internal/models"
	"letterboxd-viewer-backend/internal/repositories"
	"letterboxd-viewer-backend/internal/services"

	"github.com/gin-gonic/gin"
	"github.com/mmcdole/gofeed"
)

type MovieHandler struct {
	DB          *sql.DB
	TMDBService *services.TMDBService
	Logger      *log.Logger
}

func NewMovieHandler(db *sql.DB, tmdbService *services.TMDBService, logger *log.Logger) *MovieHandler {
	return &MovieHandler{
		DB:          db,
		TMDBService: tmdbService,
		Logger:      logger,
	}
}

func (h *MovieHandler) SetupRoutes(router *gin.Engine) {
	api := router.Group("/api")
	{
		api.GET("/rss", h.GetMovies)
		api.GET("/movie/:guid", h.GetMovieByGUID)
		api.GET("/movie/:guid/credits", h.GetMovieCredits)
	}
}

func (h *MovieHandler) GetMovies(c *gin.Context) {

	movies, err := h.processRSSFeed()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, movies)
}

func (h *MovieHandler) processRSSFeed() ([]models.Movie, error) {

	content, err := ioutil.ReadFile("/home/Área de trabalho/Vimos/teste.rss")
	if err != nil {
		h.Logger.Printf("Erro ao ler o arquivo RSS: %v", err)
		return nil, err
	}

	fp := gofeed.NewParser()
	feed, err := fp.ParseString(string(content))
	if err != nil {
		h.Logger.Printf("Erro ao fazer parse do RSS: %v", err)
		return nil, err
	}

	h.processFeedItems(feed)

	return h.getAllMovies()
}

func (h *MovieHandler) processFeedItems(feed *gofeed.Feed) {
	for _, item := range feed.Items {
		guid := item.GUID
		exists, err := repositories.CheckMovieExists(h.DB, guid)
		if err != nil {
			h.Logger.Printf("Erro ao verificar filme no banco de dados: %v", err)
			continue
		}
		if exists {
			continue
		}

		movie := h.createMovieFromFeedItem(item)
		if movie == nil {
			continue
		}

		err = repositories.InsertMovie(h.DB, movie)
		if err != nil {
			h.Logger.Printf("Erro ao inserir filme no banco de dados: %v", err)
			continue
		}
		h.Logger.Printf("Filme %s inserido com sucesso", movie.Title)
	}
}

func (h *MovieHandler) createMovieFromFeedItem(item *gofeed.Item) *models.Movie {
	guid := item.GUID

	var watchedDate, memberRating string
	if ext, ok := item.Extensions["letterboxd"]; ok {
		if len(ext["watchedDate"]) > 0 {
			watchedDate = ext["watchedDate"][0].Value
		} else {
			h.Logger.Printf("watchedDate não encontrado para o item com GUID: %s", guid)
		}

		if len(ext["memberRating"]) > 0 {
			memberRating = ext["memberRating"][0].Value
		} else {
			h.Logger.Printf("memberRating não encontrado para o item com GUID: %s", guid)
		}
	}

	movie := &models.Movie{
		Title:        item.Extensions["letterboxd"]["filmTitle"][0].Value,
		Year:         item.Extensions["letterboxd"]["filmYear"][0].Value,
		WatchedDate:  watchedDate,
		MemberRating: memberRating,
		Description:  item.Description,
		GUID:         guid,
	}

	if tmdb, ok := item.Extensions["tmdb"]; ok {
		if movieId, ok := tmdb["movieId"]; ok && len(movieId) > 0 {
			movie.TMDBId = movieId[0].Value

			tmdbInfo, err := h.TMDBService.GetMovieInfo(movie.TMDBId)
			if err != nil {
				h.Logger.Printf("Erro ao buscar informações do TMDb: %v", err)
			} else {

				h.updateMovieWithTMDBInfo(movie, tmdbInfo)
			}
		}
	}

	return movie
}

func (h *MovieHandler) updateMovieWithTMDBInfo(movie *models.Movie, tmdbInfo *models.Movie) {
	movie.Plot = tmdbInfo.Plot
	movie.Genre = tmdbInfo.Genre
	movie.Director = tmdbInfo.Director
	movie.IMDBRating = tmdbInfo.IMDBRating
	movie.Runtime = tmdbInfo.Runtime
	movie.ReleaseDate = tmdbInfo.ReleaseDate
	movie.Budget = tmdbInfo.Budget
	movie.Revenue = tmdbInfo.Revenue
	movie.Tagline = tmdbInfo.Tagline
	movie.Status = tmdbInfo.Status
	movie.OriginalLanguage = tmdbInfo.OriginalLanguage
	movie.ProductionCompanies = tmdbInfo.ProductionCompanies
	movie.SpokenLanguages = tmdbInfo.SpokenLanguages
	movie.PosterPath = tmdbInfo.PosterPath
	movie.BackdropPath = tmdbInfo.BackdropPath
	movie.Homepage = tmdbInfo.Homepage
}

func (h *MovieHandler) getAllMovies() ([]models.Movie, error) {
	var allMovies []models.Movie
	rows, err := h.DB.Query("SELECT * FROM public.filmes")
	if err != nil {
		h.Logger.Printf("Erro ao buscar filmes do banco de dados: %v", err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var movie models.Movie
		err = rows.Scan(
			&movie.ID, &movie.Title, &movie.Year, &movie.WatchedDate, &movie.MemberRating,
			&movie.Description, &movie.IMDBRating, &movie.Genre, &movie.Plot, &movie.Director,
			&movie.TMDBId, &movie.Runtime, &movie.ReleaseDate, &movie.Budget, &movie.Revenue,
			&movie.Tagline, &movie.Status, &movie.OriginalLanguage, &movie.ProductionCompanies,
			&movie.SpokenLanguages, &movie.PosterPath, &movie.BackdropPath, &movie.Homepage, &movie.GUID,
		)
		if err != nil {
			h.Logger.Printf("Erro ao ler o filme do banco de dados: %v", err)
			continue
		}
		allMovies = append(allMovies, movie)
	}

	h.Logger.Printf("Total de filmes no banco de dados: %d", len(allMovies))
	return allMovies, nil
}

func (h *MovieHandler) GetMovieByGUID(c *gin.Context) {
	guid := c.Param("guid")
	if guid == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "GUID não fornecido"})
		return
	}

	movie, err := repositories.GetMovieByGUID(h.DB, guid)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Filme não encontrado"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar filme no banco de dados"})
		}
		return
	}

	c.JSON(http.StatusOK, movie)
}

func (h *MovieHandler) GetMovieCredits(c *gin.Context) {
	guid := c.Param("guid")
	if guid == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "GUID não fornecido"})
		return
	}

	movie, err := repositories.GetMovieByGUID(h.DB, guid)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Filme não encontrado"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar filme no banco de dados"})
		}
		return
	}

	if movie.TMDBId == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID do TMDB não disponível para o filme especificado"})
		return
	}

	credits, err := h.TMDBService.GetMovieCredits(movie.TMDBId)
	if err != nil {
		h.Logger.Printf("Erro ao buscar créditos do TMDb: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar créditos do TMDb"})
		return
	}

	c.JSON(http.StatusOK, credits)
}

func SetupRoutes(router *gin.Engine, db *sql.DB) {
	logger := log.New(os.Stdout, "[MovieHandler] ", log.LstdFlags)
	tmdbService := services.NewTMDBService(os.Getenv("TMDB_ACCESS_TOKEN"))

	handler := NewMovieHandler(db, tmdbService, logger)
	handler.SetupRoutes(router)
}
