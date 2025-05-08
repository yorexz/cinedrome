package repositories

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"letterboxd-viewer-backend/internal/models"
	"time"
)

type MovieRepository struct {
	DB *sql.DB
}

func NewMovieRepository(db *sql.DB) *MovieRepository {
	return &MovieRepository{
		DB: db,
	}
}

func (r *MovieRepository) CheckMovieExists(guid string) (bool, error) {
	var exists bool
	query := `SELECT EXISTS(SELECT 1 FROM public.filmes WHERE guid=$1)`

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err := r.DB.QueryRowContext(ctx, query, guid).Scan(&exists)
	if err != nil {
		return false, fmt.Errorf("erro ao verificar existência do filme: %w", err)
	}

	return exists, nil
}

func (r *MovieRepository) InsertMovie(movie *models.Movie) error {
	query := `
		INSERT INTO filmes (
			title, year, watched_date, member_rating, description, imdb_rating, genre, plot, director,
			tmdb_id, runtime, release_date, budget, revenue, tagline, status, original_language,
			production_companies, spoken_languages, poster_path, backdrop_path, homepage, guid
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23
		)`

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := r.DB.ExecContext(
		ctx,
		query,
		movie.Title, movie.Year, toNullString(movie.WatchedDate), movie.MemberRating, movie.Description, movie.IMDBRating,
		movie.Genre, movie.Plot, movie.Director, movie.TMDBId, movie.Runtime, toNullString(movie.ReleaseDate), movie.Budget,
		movie.Revenue, movie.Tagline, movie.Status, movie.OriginalLanguage, movie.ProductionCompanies,
		movie.SpokenLanguages, movie.PosterPath, movie.BackdropPath, movie.Homepage, movie.GUID,
	)
	if err != nil {
		return fmt.Errorf("erro ao inserir filme: %w", err)
	}

	return nil
}

func (r *MovieRepository) GetMovieByGUID(guid string) (*models.Movie, error) {
	var movie models.Movie
	query := `SELECT * FROM public.filmes WHERE guid=$1`

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err := r.DB.QueryRowContext(ctx, query, guid).Scan(
		&movie.ID, &movie.Title, &movie.Year, &movie.WatchedDate, &movie.MemberRating,
		&movie.Description, &movie.IMDBRating, &movie.Genre, &movie.Plot, &movie.Director,
		&movie.TMDBId, &movie.Runtime, &movie.ReleaseDate, &movie.Budget, &movie.Revenue,
		&movie.Tagline, &movie.Status, &movie.OriginalLanguage, &movie.ProductionCompanies,
		&movie.SpokenLanguages, &movie.PosterPath, &movie.BackdropPath, &movie.Homepage, &movie.GUID,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, sql.ErrNoRows
		}
		return nil, fmt.Errorf("erro ao buscar filme por GUID: %w", err)
	}

	return &movie, nil
}

func (r *MovieRepository) GetAllMovies() ([]models.Movie, error) {
	var movies []models.Movie
	query := `SELECT * FROM public.filmes ORDER BY watched_date DESC NULLS LAST`

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	rows, err := r.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("erro ao buscar todos os filmes: %w", err)
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
			return nil, fmt.Errorf("erro ao ler filme: %w", err)
		}
		movies = append(movies, movie)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("erro ao iterar sobre os filmes: %w", err)
	}

	return movies, nil
}

func toNullString(value string) sql.NullString {
	if value == "" {
		return sql.NullString{}
	}
	return sql.NullString{String: value, Valid: true}
}

func CheckMovieExists(db *sql.DB, guid string) (bool, error) {
	repo := NewMovieRepository(db)
	return repo.CheckMovieExists(guid)
}

func InsertMovie(db *sql.DB, movie *models.Movie) error {
	repo := NewMovieRepository(db)
	return repo.InsertMovie(movie)
}

func GetMovieByGUID(db *sql.DB, guid string) (*models.Movie, error) {
	repo := NewMovieRepository(db)
	return repo.GetMovieByGUID(guid)
}
