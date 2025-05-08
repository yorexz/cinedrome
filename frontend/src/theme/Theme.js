import { createTheme } from "@mui/material/styles";

const COLORS = {

  RED: {
    MAIN: "#E50914",
    LIGHT: "#FF4136",
    DARK: "#B90710",
  },
  BLUE: {
    MAIN: "#0077B5",
    LIGHT: "#4ECDC4",
    DARK: "#005582",
  },


  LIGHT: {
    BACKGROUND: "#F5F5F5",
    PAPER: "#FFFFFF",
    TEXT_PRIMARY: "#333333",
    TEXT_SECONDARY: "#666666",
  },
  DARK: {
    BACKGROUND: "#121212",
    PAPER: "#1E1E1E",
    TEXT_PRIMARY: "#FFFFFF",
    TEXT_SECONDARY: "#B0B0B0",
  },
};

const TYPOGRAPHY = {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  h1: {
    fontSize: "2.5rem",
    fontWeight: 700,
  },
  h2: {
    fontSize: "2rem",
    fontWeight: 600,
  },
  h3: {
    fontSize: "1.75rem",
    fontWeight: 600,
  },
  h4: {
    fontSize: "1.5rem",
    fontWeight: 600,
  },
  h5: {
    fontSize: "1.25rem",
    fontWeight: 600,
  },
  h6: {
    fontSize: "1rem",
    fontWeight: 600,
  },
  body1: {
    fontSize: "1rem",
  },
  body2: {
    fontSize: "0.875rem",
  },
  button: {
    fontWeight: 500,
    textTransform: "none",
  },
};

const SHAPE = {
  borderRadius: 4,
};

const BREAKPOINTS = {
  values: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },
};

const COMPONENTS = {
  MuiCard: {
    styleOverrides: {
      root: {
        transition: "all 0.3s ease-in-out",
      },
    },
  },
  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: "8px",
        "&:last-child": {
          paddingBottom: "8px",
        },
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 4,
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: "none",
      },
    },
  },
};

const baseTheme = {
  typography: TYPOGRAPHY,
  shape: SHAPE,
  breakpoints: BREAKPOINTS,
  components: COMPONENTS,
};

const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: "light",
    primary: {
      main: COLORS.RED.MAIN,
      light: COLORS.RED.LIGHT,
      dark: COLORS.RED.DARK,
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: COLORS.BLUE.MAIN,
      light: COLORS.BLUE.LIGHT,
      dark: COLORS.BLUE.DARK,
      contrastText: "#FFFFFF",
    },
    background: {
      default: COLORS.LIGHT.BACKGROUND,
      paper: COLORS.LIGHT.PAPER,
    },
    text: {
      primary: COLORS.LIGHT.TEXT_PRIMARY,
      secondary: COLORS.LIGHT.TEXT_SECONDARY,
    },
  },
  components: {
    ...COMPONENTS,
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: COLORS.RED.MAIN,
        },
      },
    },
  },
});

const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: "dark",
    primary: {
      main: COLORS.RED.LIGHT,
      light: "#FF6B63",
      dark: COLORS.RED.MAIN,
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: COLORS.BLUE.LIGHT,
      light: "#7EEAE2",
      dark: COLORS.BLUE.MAIN,
      contrastText: "#000000",
    },
    background: {
      default: COLORS.DARK.BACKGROUND,
      paper: COLORS.DARK.PAPER,
    },
    text: {
      primary: COLORS.DARK.TEXT_PRIMARY,
      secondary: COLORS.DARK.TEXT_SECONDARY,
    },
  },
  components: {
    ...COMPONENTS,
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#1A1A1A",
        },
      },
    },
  },
});

export { lightTheme, darkTheme };
