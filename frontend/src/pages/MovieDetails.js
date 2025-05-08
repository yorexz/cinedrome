import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Typography,
  Box,
  CircularProgress,
  Grid,
  CardMedia,
  Chip,
  Rating,
  Card,
  CardContent,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  AccessTime,
  CalendarToday,
  Language,
  AttachMoney,
  MovieFilter,
  Public,
  FormatQuote,
} from "@mui/icons-material";
import {
  fetchMovieDetails,
  fetchMovieCredits,
} from "../services/movieServices";
import { API_ENDPOINTS, COLORS } from "../constants/constants";
import MovieDetailsContent from "../components/MovieDetailsContent";

const HeroSection = styled(Box)(({ theme }) => ({
  position: "relative",
  height: "94vh",
  backgroundSize: "cover",
  backgroundPosition: "center 20%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  padding: theme.spacing(3),
}));

const BackButton = styled(Link)({
  position: "absolute",
  top: 20,
  right: 20,
  textDecoration: "none",
});

const MovieTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 900,
  marginBottom: theme.spacing(1),
  textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
  fontFamily: "Greycliff, sans-serif",
}));

const MovieYear = styled(Typography)(({ theme }) => ({
  fontWeight: 100,
  marginBottom: theme.spacing(1),
  textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
  fontFamily: "Greycliff, sans-serif",
}));

const PosterImage = styled(CardMedia)({
  width: "100%",
  height: "auto",
  maxHeight: "100%",
  borderRadius: 8,
});

const TaglineBox = styled(Box)(({ theme }) => ({
  backgroundColor: "rgba(229, 9, 20, 0.1)",
  borderLeft: `4px solid ${COLORS.PRIMARY}`,
  padding: theme.spacing(2),
  borderRadius: "0 4px 4px 0",
  marginTop: theme.spacing(2),
}));

const MoviePlot = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  fontSize: "1.2rem",
  lineHeight: 1,
  textAlign: "justify",
}));

const RatingCard = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: COLORS.OVERLAY_BG,
  padding: theme.spacing(2),
  maxWidth: "50%",
  borderRadius: theme.shape.borderRadius * 2,
  marginBottom: theme.spacing(4),
}));

const CastSectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  color: COLORS.PRIMARY,
}));

const CastCard = styled(Card)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  backgroundColor: COLORS.OVERLAY_BG,
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: "none",
}));

const CastAvatar = styled(CardMedia)(({ theme }) => ({
  width: 60,
  height: 60,
  borderRadius: "50%",
  marginRight: theme.spacing(2),
}));

const MovieDetails = () => {
  const { guid } = useParams();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadMovieData = async () => {
      try {
        const movieData = await fetchMovieDetails(guid);
        setMovie(movieData);

        const creditsData = await fetchMovieCredits(guid);
        setCredits(creditsData);
      } catch (error) {
        console.error("Erro ao buscar detalhes do filme:", error);
        setError(
          "Ocorreu um erro ao carregar os detalhes do filme. Por favor, tente novamente mais tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    loadMovieData();
  }, [guid]);

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{ bgcolor: COLORS.BACKGROUND, color: COLORS.TEXT_PRIMARY }}
      >
        <CircularProgress color="secondary" />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Carregando detalhes do filme...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        textAlign="center"
        my={4}
        sx={{
          bgcolor: COLORS.BACKGROUND,
          color: COLORS.TEXT_PRIMARY,
          minHeight: "100vh",
          pt: 4,
        }}
      >
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!movie) {
    return (
      <Box
        textAlign="center"
        my={4}
        sx={{
          bgcolor: COLORS.BACKGROUND,
          color: COLORS.TEXT_PRIMARY,
          minHeight: "100vh",
          pt: 4,
        }}
      >
        <Typography>Filme não encontrado.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: COLORS.BACKGROUND,
        color: COLORS.TEXT_PRIMARY,
        minHeight: "100vh",
      }}
    >
      <HeroSection
        sx={{
          backgroundImage: `url(${API_ENDPOINTS.TMDB_IMAGE_ORIGINAL}${movie.backdrop_path})`,
        }}
      >
        <BackButton to="/">
          <Chip
            label="Voltar para a lista"
            variant="filled"
            sx={{
              backgroundColor: COLORS.TEXT_PRIMARY,
              color: "#000",
              borderColor: "#000",
              "&:hover": { bgcolor: "rgba(255, 255, 255, 0.7)" },
            }}
          />
        </BackButton>
        <MovieTitle variant="h1" component="h1">
          {movie.title}
        </MovieTitle>
        <MovieYear variant="h5">{movie.year}</MovieYear>
      </HeroSection>

      <Grid container spacing={4} sx={{ mt: 0, px: 6 }}>
        <Grid item xs={12} md={3}>
          <PosterImage
            component="img"
            image={`${API_ENDPOINTS.TMDB_IMAGE_W500}${movie.poster_path}`}
            alt={movie.title}
          />
          {movie.tagline && (
            <TaglineBox>
              <Typography
                variant="body1"
                sx={{
                  fontStyle: "italic",
                  color: COLORS.TEXT_PRIMARY,
                  fontSize: "1.1rem",
                  lineHeight: 1.4,
                  display: "flex",
                  alignItems: "flex-start",
                }}
              >
                <FormatQuote
                  sx={{
                    color: COLORS.PRIMARY,
                    fontSize: "2rem",
                    mr: 1,
                    transform: "rotate(180deg)",
                  }}
                />
                {movie.tagline}
              </Typography>
            </TaglineBox>
          )}
        </Grid>
        <Grid item xs={12} md={9}>
          <MovieDetailsContent movie={movie} credits={credits} />
        </Grid>
      </Grid>
    </Box>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
      {React.cloneElement(icon, { sx: { color: COLORS.PRIMARY, mr: 1 } })}
      <Typography
        variant="body2"
        sx={{ fontWeight: 700, color: COLORS.PRIMARY }}
      >
        {label}
      </Typography>
    </Box>
    <Typography
      variant="body1"
      sx={{ ml: 4, color: COLORS.TEXT_SECONDARY, fontSize: "1rem" }}
    >
      {value || "N/A"}
    </Typography>
  </Grid>
);

export default MovieDetails;
