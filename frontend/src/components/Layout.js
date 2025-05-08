import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  useTheme,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MovieIcon from "@mui/icons-material/Movie";
import PropTypes from "prop-types";

const Layout = ({ children, toggleTheme }) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <MovieIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Meus Filmes
          </Typography>
          <IconButton onClick={toggleTheme} color="inherit">
            {theme.palette.mode === "dark" ? (
              <Brightness7Icon />
            ) : (
              <Brightness4Icon />
            )}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, py: 0 }}>
        {children}
      </Box>
      <Box component="footer" sx={{ py: 3, textAlign: "center", mt: "auto" }}>
        <Typography variant="body2" color="text.secondary">
          © 2024 Meus Filmes. Todos os direitos reservados.
        </Typography>
      </Box>
    </Box>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

export default Layout;
