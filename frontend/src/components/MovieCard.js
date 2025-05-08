import React, { useState, useMemo } from "react";
import { Card, CardMedia, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { API_ENDPOINTS } from "../constants/constants";
import ErrorCard from "./ErrorCard";
import ImageFallback from "./ImageFallback";

const StyledCard = styled(motion(Card))(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  overflow: "hidden",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[10],
  },
}));

const StyledCardMedia = styled(Box)({
  position: "relative",
  paddingTop: "150%",
});

const Overlay = styled(Box)(({ ishovered }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  transition: "all 0.3s ease-in-out",
  opacity: ishovered === "true" ? 1 : 0,
}));

const ContentOverlay = styled(Box)({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  padding: "16px",
  background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
});

const YearText = styled(Typography)({
  color: "white",
  fontWeight: "bold",
});

const StarIcon = styled(Star)({
  color: "#FFD700",
  width: 16,
  height: 16,
  marginRight: 4,
});

const RatingText = styled(Typography)({
  color: "white",
  fontWeight: "bold",
});

const MovieCard = ({ movie }) => {
  const [isHovered, setIsHovered] = useState(false);

  const posterUrl = useMemo(() => {
    return movie?.poster_path
      ? `${API_ENDPOINTS.TMDB_IMAGE_W500}${movie.poster_path}`
      : "/api/placeholder/300/450";
  }, [movie?.poster_path]);

  if (!movie?.guid) {
    console.error("Movie without GUID:", movie);
    return <ErrorCard message="Dados do filme incompletos" />;
  }

  return (
    <StyledCard
      component={Link}
      to={`/movie/${encodeURIComponent(movie.guid)}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`Ver detalhes de ${movie.title}`}
    >
      <StyledCardMedia>
        <ImageFallback
          src={posterUrl}
          alt={movie.title}
          fallbackSrc="/api/placeholder/300/450"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        <Overlay ishovered={isHovered.toString()} />

        <ContentOverlay>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" alignItems="center">
              <YearText variant="body2">
                {movie.year || "N/A"}
              </YearText>
            </Box>
            <Box display="flex" alignItems="center">
              <StarIcon />
              <RatingText variant="body2">
                {movie.memberRating || "N/A"}{" "}
              </RatingText>
            </Box>
          </Box>
        </ContentOverlay>
      </StyledCardMedia>
    </StyledCard>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    guid: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    poster_path: PropTypes.string,
    year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    memberRating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
};

export default React.memo(MovieCard);
