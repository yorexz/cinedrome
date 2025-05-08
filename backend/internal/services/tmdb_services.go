package services

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"letterboxd-viewer-backend/internal/models"
	"log"
	"net/http"
	"strings"
	"time"
)

type MovieCredits struct {
	ID   int          `json:"id"`
	Cast []CastMember `json:"cast"`
	Crew []CrewMember `json:"crew"`
}

type CastMember struct {
	CastID      int     `json:"cast_id"`
	Character   string  `json:"character"`
	CreditID    string  `json:"credit_id"`
	Gender      int     `json:"gender"`
	ID          int     `json:"id"`
	Name        string  `json:"name"`
	Order       int     `json:"order"`
	ProfilePath *string `json:"profile_path"`
}

type CrewMember struct {
	CreditID    string  `json:"credit_id"`
	Department  string  `json:"department"`
	Gender      int     `json:"gender"`
	ID          int     `json:"id"`
	Job         string  `json:"job"`
	Name        string  `json:"name"`
	ProfilePath *string `json:"profile_path"`
}

type TMDBService struct {
	AccessToken string
	Client      *http.Client
	BaseURL     string
	Logger      *log.Logger
}

type TMDBMovieResponse struct {
	Title       string  `json:"title"`
	Overview    string  `json:"overview"`
	VoteAverage float64 `json:"vote_average"`
	Runtime     int     `json:"runtime"`
	Genres      []struct {
		Name string `json:"name"`
	} `json:"genres"`
	ProductionCompanies []struct {
		Name string `json:"name"`
	} `json:"production_companies"`
	ReleaseDate      string `json:"release_date"`
	Budget           int    `json:"budget"`
	Revenue          int    `json:"revenue"`
	PosterPath       string `json:"poster_path"`
	BackdropPath     string `json:"backdrop_path"`
	Homepage         string `json:"homepage"`
	Tagline          string `json:"tagline"`
	Status           string `json:"status"`
	OriginalLanguage string `json:"original_language"`
	SpokenLanguages  []struct {
		Name string `json:"name"`
	} `json:"spoken_languages"`
}

func NewTMDBService(accessToken string) *TMDBService {
	return &TMDBService{
		AccessToken: accessToken,
		Client: &http.Client{
			Timeout: 10 * time.Second,
		},
		BaseURL: "https://api.themoviedb.org/3",
		Logger:  log.New(log.Writer(), "[TMDBService] ", log.LstdFlags),
	}
}

func (s *TMDBService) getMovieInfoByLanguage(tmdbId, language string) (*models.Movie, error) {
	url := fmt.Sprintf("%s/movie/%s?language=%s", s.BaseURL, tmdbId, language)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("erro ao criar request: %w", err)
	}

	s.setRequestHeaders(req)

	response, err := s.Client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("erro na requisição: %w", err)
	}
	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		body, _ := ioutil.ReadAll(response.Body)
		s.Logger.Printf("Erro na resposta do TMDb: %s", string(body))
		return nil, fmt.Errorf("erro de status code: %d %s", response.StatusCode, response.Status)
	}

	var tmdbResponse TMDBMovieResponse
	if err := json.NewDecoder(response.Body).Decode(&tmdbResponse); err != nil {
		return nil, fmt.Errorf("erro ao decodificar resposta: %w", err)
	}

	return s.convertResponseToMovie(&tmdbResponse), nil
}

func (s *TMDBService) setRequestHeaders(req *http.Request) {
	req.Header.Set("accept", "application/json")
	req.Header.Set("Authorization", "Bearer "+s.AccessToken)
}

func (s *TMDBService) convertResponseToMovie(response *TMDBMovieResponse) *models.Movie {
	movie := &models.Movie{
		Title:            response.Title,
		Plot:             response.Overview,
		IMDBRating:       fmt.Sprintf("%.1f", response.VoteAverage),
		Runtime:          response.Runtime,
		ReleaseDate:      response.ReleaseDate,
		Budget:           response.Budget,
		Revenue:          response.Revenue,
		Tagline:          response.Tagline,
		Status:           response.Status,
		OriginalLanguage: response.OriginalLanguage,
		PosterPath:       response.PosterPath,
		BackdropPath:     response.BackdropPath,
		Homepage:         response.Homepage,
	}

	var genres []string
	for _, genre := range response.Genres {
		genres = append(genres, genre.Name)
	}
	movie.Genre = strings.Join(genres, ", ")

	var productionCompanies []string
	for _, company := range response.ProductionCompanies {
		productionCompanies = append(productionCompanies, company.Name)
	}
	movie.ProductionCompanies = strings.Join(productionCompanies, ", ")

	var languages []string
	for _, language := range response.SpokenLanguages {
		languages = append(languages, language.Name)
	}
	movie.SpokenLanguages = strings.Join(languages, ", ")

	return movie
}

func (s *TMDBService) GetMovieInfo(tmdbId string) (*models.Movie, error) {
	moviePTBR, err := s.getMovieInfoByLanguage(tmdbId, "pt-BR")
	if err != nil {
		return nil, fmt.Errorf("erro ao buscar informações em pt-BR: %w", err)
	}

	movieEN, err := s.getMovieInfoByLanguage(tmdbId, "en-US")
	if err != nil {
		return nil, fmt.Errorf("erro ao buscar informações em en-US: %w", err)
	}

	moviePTBR.PosterPath = movieEN.PosterPath
	moviePTBR.BackdropPath = movieEN.BackdropPath

	if moviePTBR.Plot == "" {
		moviePTBR.Plot = movieEN.Plot
	}

	return moviePTBR, nil
}

func (s *TMDBService) GetMovieCredits(tmdbId string) (*MovieCredits, error) {
	url := fmt.Sprintf("%s/movie/%s/credits", s.BaseURL, tmdbId)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("erro ao criar request: %w", err)
	}

	s.setRequestHeaders(req)

	response, err := s.Client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("erro na requisição: %w", err)
	}
	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		body, _ := ioutil.ReadAll(response.Body)
		s.Logger.Printf("Erro na resposta do TMDb: %s", string(body))
		return nil, fmt.Errorf("erro de status code: %d %s", response.StatusCode, response.Status)
	}

	var credits MovieCredits
	if err := json.NewDecoder(response.Body).Decode(&credits); err != nil {
		return nil, fmt.Errorf("erro ao decodificar resposta: %w", err)
	}

	return &credits, nil
}
