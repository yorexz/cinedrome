import React from "react";
import {
  Typography,
  Box,
  Grid,
  Chip,
  Rating,
  Card,
  CardContent,
  Divider,
  Avatar,
  useTheme,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  AccessTime,
  CalendarToday,
  Language,
  AttachMoney,
  MovieFilter,
  Public,
  Star,
} from "@mui/icons-material";
import PropTypes from "prop-types";

const COLORS = {
  PRIMARY: "#2C3E50", 
  SECONDARY: "#3498DB", 
  ACCENT: "#34495E", 
  SUCCESS: "#2ECC71", 
  WARNING: "#F39C12", 
  TEXT: {
    PRIMARY: "#ECF0F1",
    SECONDARY: "#BDC3C7", 
  },
  BACKGROUND: {
    CARD: "rgba(52, 73, 94, 0.2)", 
    HOVER: "rgba(52, 73, 94, 0.4)", 
    SECTION: "rgba(44, 62, 80, 0.15)", 
  },
  DIVIDER: "rgba(52, 152, 219, 0.2)",
};


const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  position: "relative",
  paddingLeft: theme.spacing(2),
  letterSpacing: "0.05em",
  color: COLORS.TEXT.PRIMARY,
  "&:before": {
    content: '""',
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: COLORS.SECONDARY,
    borderRadius: theme.shape.borderRadius,
  },
}));

const PlotContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  backgroundColor: COLORS.BACKGROUND.CARD,
  borderRadius: theme.spacing(1),
  position: "relative",
  overflow: "hidden",
  backdropFilter: "blur(10px)",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
}));

const InfoGrid = styled(Grid)(({ theme }) => ({
  backgroundColor: COLORS.BACKGROUND.SECTION,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  backdropFilter: "blur(10px)",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
}));

const InfoCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  backgroundColor: COLORS.BACKGROUND.CARD,
  transition: "all 0.3s ease",
  borderRadius: theme.spacing(1),
  "&:hover": {
    transform: "translateY(-5px)",
    backgroundColor: COLORS.BACKGROUND.HOVER,
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
  },
}));

const RatingCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: "rgba(41, 128, 185, 0.1)", 
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(4),
  display: "flex",
  justifyContent: "space-between",
  position: "relative",
  overflow: "hidden",
  backdropFilter: "blur(10px)",
  "&:before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: 3,
    height: "100%",
    backgroundColor: COLORS.SECONDARY,
  },
}));

const CastCard = styled(Card)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  backgroundColor: COLORS.BACKGROUND.CARD,
  borderRadius: theme.spacing(1),
  overflow: "hidden",
  height: "100%",
  transition: "all 0.3s ease",
  backdropFilter: "blur(5px)",
  "&:hover": {
    transform: "translateY(-5px)",
    backgroundColor: COLORS.BACKGROUND.HOVER,
    boxShadow: `0 8px 16px rgba(52, 152, 219, 0.15)`,
  },
}));

const CastAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: 0,
}));

const CastInfo = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
}));

const InfoItem = ({ icon, label, value }) => {
  const theme = useTheme();

  return (
    <InfoCard elevation={0}>
      <Box sx={{ mb: 1, display: "flex", alignItems: "center" }}>
        {React.cloneElement(icon, {
          sx: {
            color: COLORS.SECONDARY,
            fontSize: 28,
            mb: 1,
          },
        })}
      </Box>
      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          color: COLORS.SECONDARY,
          textTransform: "uppercase",
          fontSize: "0.75rem",
          letterSpacing: 0.5,
          mb: 0.5,
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: COLORS.TEXT.PRIMARY,
          fontSize: "1.1rem",
          fontWeight: 500,
        }}
      >
        {value || "N/A"}
      </Typography>
    </InfoCard>
  );
};

const MovieDetailsContent = ({ movie, credits }) => {
  if (!movie) return null;

  return (
    <Box>
      <SectionTitle variant="h5" gutterBottom>
        Sinopse
      </SectionTitle>
      <PlotContainer elevation={0}>
        <Typography
          variant="body1"
          paragraph
          sx={{
            fontSize: "1.2rem",
            lineHeight: 1.6,
            letterSpacing: 0.3,
            textAlign: "justify",
            fontWeight: 300,
            color: COLORS.TEXT.PRIMARY,
            mb: 0,
          }}
        >
          {movie.plot}
        </Typography>
      </PlotContainer>

      <SectionTitle variant="h5" gutterBottom>
        Informações
      </SectionTitle>
      <Box component={InfoGrid} elevation={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <InfoItem
              icon={<MovieFilter />}
              label="Gênero"
              value={movie.genre}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InfoItem
              icon={<AccessTime />}
              label="Duração"
              value={`${movie.runtime} minutos`}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InfoItem
              icon={<CalendarToday />}
              label="Lançamento"
              value={movie.releaseDate}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InfoItem
              icon={<Language />}
              label="Idioma Original"
              value={movie.original_language?.toUpperCase()}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InfoItem
              icon={<AttachMoney />}
              label="Orçamento"
              value={`$${movie.budget?.toLocaleString()}`}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InfoItem icon={<Public />} label="Status" value={movie.status} />
          </Grid>
        </Grid>
      </Box>

      {movie.imdbRating && (
        <RatingCard elevation={0}>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: COLORS.SECONDARY,
                mb: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Star sx={{ mr: 1 }} /> Avaliação IMDb
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Rating
                value={parseFloat(movie.imdbRating) / 2}
                readOnly
                precision={0.1}
                sx={{ mr: 2, color: COLORS.SECONDARY }}
              />
              <Typography
                variant="h4"
                sx={{
                  color: COLORS.SECONDARY,
                  fontWeight: 700,
                  fontFamily: "'Roboto Condensed', sans-serif",
                }}
              >
                {movie.imdbRating}
                <Typography
                  component="span"
                  sx={{
                    fontSize: "1rem",
                    color: COLORS.TEXT.SECONDARY,
                    ml: 0.5,
                  }}
                >
                  /10
                </Typography>
              </Typography>
            </Box>
          </Box>
          <Box
            textAlign="right"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            <Chip
              label="TMDb"
              size="small"
              sx={{
                backgroundColor: "rgba(52, 152, 219, 0.1)",
                color: COLORS.SECONDARY,
                fontWeight: "bold",
                mb: 1,
              }}
            />
            <Typography variant="body2" sx={{ color: COLORS.TEXT.SECONDARY }}>
              Atualizado automaticamente
            </Typography>
          </Box>
        </RatingCard>
      )}

      {credits && credits.cast && credits.cast.length > 0 && (
        <Box>
          <SectionTitle variant="h5">Elenco Principal</SectionTitle>
          <Grid container spacing={3}>
            {credits.cast.slice(0, 6).map((castMember) => (
              <Grid item xs={12} sm={6} md={4} key={castMember.id}>
                <CastCard elevation={0}>
                  <CastAvatar
                    src={
                      castMember.profile_path
                        ? `https://image.tmdb.org/t/p/w185${castMember.profile_path}`
                        : "/placeholder-actor.jpg"
                    }
                    alt={castMember.name}
                    variant="square"
                  />
                  <CastInfo>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: COLORS.TEXT.PRIMARY,
                        mb: 0.5,
                        fontSize: "1rem",
                      }}
                    >
                      {castMember.name}
                    </Typography>
                    <Divider sx={{ my: 1, backgroundColor: COLORS.DIVIDER }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: COLORS.TEXT.SECONDARY,
                        fontSize: "0.9rem",
                        fontStyle: "italic",
                      }}
                    >
                      {castMember.character}
                    </Typography>
                  </CastInfo>
                </CastCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

MovieDetailsContent.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string,
    plot: PropTypes.string,
    genre: PropTypes.string,
    runtime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    releaseDate: PropTypes.string,
    original_language: PropTypes.string,
    budget: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    status: PropTypes.string,
    imdbRating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  credits: PropTypes.shape({
    cast: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        character: PropTypes.string,
        profile_path: PropTypes.string,
      })
    ),
  }),
};

export default MovieDetailsContent;
