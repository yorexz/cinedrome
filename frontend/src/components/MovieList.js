import React, { useState, useEffect, useCallback } from "react";
import {
  Grid,
  Typography,
  Box,
  CircularProgress,
  Container,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import axios from "axios";
import MovieCard from "./MovieCard";
import { API_ENDPOINTS } from "../constants/constants";

const MotionGrid = motion(Grid);

const EmptyState = ({ message }) => (
  <Box textAlign="center" my={8} data-testid="empty-state">
    <Typography variant="h6" color="text.secondary">
      {message}
    </Typography>
  </Box>
);

EmptyState.propTypes = {
  message: PropTypes.string.isRequired,
};

const LoadingState = () => (
  <Box
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    minHeight="60vh"
    data-testid="loading-state"
  >
    <CircularProgress color="secondary" size={40} thickness={4} />
    <Typography variant="body1" sx={{ mt: 2, color: "text.secondary" }}>
      Carregando filmes...
    </Typography>
  </Box>
);

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_ENDPOINTS.BASE_URL}/rss`);
      const moviesWithDates = response.data.map((movie) => ({
        ...movie,
        watchedDate: movie.watchedDate ? new Date(movie.watchedDate) : null,
        guid: movie.guid || `movie-${movie.tmdbId}`,
      }));

      const sortedMovies = moviesWithDates
        .filter((movie) => movie.watchedDate)
        .sort((a, b) => b.watchedDate - a.watchedDate);

      setMovies(sortedMovies);
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
      setError(
        "Ocorreu um erro ao carregar os filmes. Por favor, tente novamente mais tarde."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Alert
          severity="error"
          variant="outlined"
          sx={{
            borderRadius: 2,
            "& .MuiAlert-icon": {
              alignItems: "center",
            },
          }}
        >
          {error}
        </Alert>
      </Container>
    );
  }

  if (movies.length === 0) {
    return <EmptyState message="Nenhum filme encontrado." />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ flexGrow: 1, py: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          sx={{
            mb: 4,
            fontWeight: 700,
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -8,
              left: "50%",
              transform: "translateX(-50%)",
              width: 60,
              height: 3,
              backgroundColor: "primary.main",
              borderRadius: 1,
            },
          }}
        >
          CineDrome
        </Typography>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={3}>
            {movies.map((movie) => (
              <MotionGrid
                item
                xs={6}
                sm={4}
                md={3}
                lg={2}
                key={movie.guid}
                variants={itemVariants}
              >
                <MovieCard movie={movie} />
              </MotionGrid>
            ))}
          </Grid>
        </motion.div>
      </Box>
    </Container>
  );
};

export default MovieList;
