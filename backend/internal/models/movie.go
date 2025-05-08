package models

import (
	"fmt"
	"time"
)

type Movie struct {
	ID                  int    `json:"id"`
	Title               string `json:"title"`
	Year                string `json:"year"`
	Image               string `json:"image"`
	WatchedDate         string `json:"watchedDate"`
	MemberRating        string `json:"memberRating"`
	Description         string `json:"description"`
	IMDBRating          string `json:"imdbRating"`
	Genre               string `json:"genre"`
	Plot                string `json:"plot"`
	Director            string `json:"director"`
	TMDBId              string `json:"tmdbId"`
	Runtime             int    `json:"runtime"`
	ReleaseDate         string `json:"releaseDate"`
	Budget              int    `json:"budget"`
	Revenue             int    `json:"revenue"`
	Tagline             string `json:"tagline"`
	Status              string `json:"status"`
	OriginalLanguage    string `json:"original_language"`
	ProductionCompanies string `json:"production_companies"`
	SpokenLanguages     string `json:"spoken_languages"`
	PosterPath          string `json:"poster_path"`
	BackdropPath        string `json:"backdrop_path"`
	Homepage            string `json:"homepage"`
	GUID                string `json:"guid"`
}

func (m *Movie) ParsedWatchedDate() (*time.Time, error) {
	if m.WatchedDate == "" {
		return nil, nil
	}
	t, err := time.Parse("2006-01-02", m.WatchedDate)
	if err != nil {
		return nil, err
	}
	return &t, nil
}

func (m *Movie) ParsedReleaseDate() (*time.Time, error) {
	if m.ReleaseDate == "" {
		return nil, nil
	}
	t, err := time.Parse("2006-01-02", m.ReleaseDate)
	if err != nil {
		return nil, err
	}
	return &t, nil
}

func (m *Movie) ParsedMemberRating() (float64, error) {
	if m.MemberRating == "" {
		return 0, nil
	}
	var rating float64
	_, err := fmt.Sscanf(m.MemberRating, "%f", &rating)
	if err != nil {
		return 0, err
	}
	return rating, nil
}

func (m *Movie) ParsedIMDBRating() (float64, error) {
	if m.IMDBRating == "" {
		return 0, nil
	}
	var rating float64
	_, err := fmt.Sscanf(m.IMDBRating, "%f", &rating)
	if err != nil {
		return 0, err
	}
	return rating, nil
}

func (m *Movie) FullPosterURL() string {
	if m.PosterPath == "" {
		return ""
	}
	return "https://image.tmdb.org/t/p/w500" + m.PosterPath
}

func (m *Movie) FullBackdropURL() string {
	if m.BackdropPath == "" {
		return ""
	}
	return "https://image.tmdb.org/t/p/original" + m.BackdropPath
}
