import React, { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  ThemeProvider,
  CssBaseline,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import { lightTheme, darkTheme } from "./theme/Theme";
import Layout from "./components/Layout";

const Home = lazy(() => import("./pages/Home"));
const MovieDetails = lazy(() => import("./pages/MovieDetails"));

const LoadingFallback = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
    sx={{ bgcolor: "#141414" }}
  >
    <CircularProgress color="secondary" />
  </Box>
);

function App() {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem("themeMode");
    return savedMode || "dark";
  });

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";
      localStorage.setItem("themeMode", newMode);
      return newMode;
    });
  };

  const theme = mode === "light" ? lightTheme : darkTheme;

  useEffect(() => {
    const metaThemeColor = document.querySelector("meta[name=theme-color]");
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        mode === "light"
          ? lightTheme.palette.background.default
          : darkTheme.palette.background.default
      );
    }
  }, [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout toggleTheme={toggleTheme}>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movie/:guid" element={<MovieDetails />} />
              <Route
                path="*"
                element={
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "70vh",
                      flexDirection: "column",
                    }}
                  >
                    <Typography variant="h4">
                      404 - Página não encontrada
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      A página que você está procurando não existe.
                    </Typography>
                  </Box>
                }
              />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
