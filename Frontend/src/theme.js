//React components and styles 
import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

// color design tokens export
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
      grey: {
        100: "#e0e0e0",
        200: "#c2c2c2",
        300: "#a3a3a3",
        400: "#858585",
        500: "#666666",
        600: "#525252",
        700: "#3d3d3d",
        800: "#292929",
        900: "#141414",
      },
      primary: {
        100: "#d0d1d5",
        200: "#a1a4ab",
        300: "#727681",
        400: "#1F2A40",
        500: "#141b2d",
        600: "#101624",
        700: "#0c101b",
        800: "#080b12",
        900: "#040509",
      },
      greenAccent: {
        100: "#dbf5ee",
        200: "#b7ebde",
        300: "#94e2cd",
        400: "#70d8bd",
        500: "#4cceac",
        600: "#3da58a",
        700: "#2e7c67",
        800: "#1e5245",
        900: "#0f2922",
      },
      redAccent: {
        100: "#f8dcdb",
        200: "#f1b9b7",
        300: "#e99592",
        400: "#e2726e",
        500: "#db4f4a",
        600: "#af3f3b",
        700: "#832f2c",
        800: "#58201e",
        900: "#2c100f",
      },
      blueAccent: {
        100: "#e1e2fe",
        200: "#c3c6fd",
        300: "#a4a9fc",
        400: "#868dfb",
        500: "#6870fa",
        600: "#535ac8",
        700: "#3e4396",
        800: "#2a2d64",
        900: "#151632",
      },
      white: {
        100: "#fdfdf8",
        200: "#fbfbf1",
        300: "#f9f9ea",
        400: "#f7f7e3",
        500: "#f5f5dc",
        600: "#c4c4b0",
        700: "#939384",
        800: "#626258",
        900: "#31312c"
      },
      orange: {
        100: "#ffe8cc",
        200: "#ffd199",
        300: "#ffba66",
        400: "#ffa333",
        500: "#ff8c00",
        600: "#cc7000",
        700: "#995400",
        800: "#663800",
        900: "#331c00"
      },
      pink: {
        100: "#e8d5f9",
        200: "#d0aaf3",
        300: "#b980ee",
        400: "#a155e8",
        500: "#8a2be2",
        600: "#6e22b5",
        700: "#531a88",
        800: "#37115a",
        900: "#1c092d"
      },
      yellow: {
        100: "#fff7cc",
        200: "#ffef99",
        300: "#ffe766",
        400: "#ffdf33",
        500: "#ffd700",
        600: "#ccac00",
        700: "#998100",
        800: "#665600",
        900: "#332b00"
      },
      lavander: {
        100: "#fafafe",
        200: "#f5f5fd",
        300: "#f0f0fc",
        400: "#ebebfb",
        500: "#e6e6fa",
        600: "#b8b8c8",
        700: "#8a8a96",
        800: "#5c5c64",
        900: "#2e2e32"
      },
      purple: {
        100: "#e6cce6",
        200: "#cc99cc",
        300: "#b366b3",
        400: "#993399",
        500: "#800080",
        600: "#660066",
        700: "#4d004d",
        800: "#330033",
        900: "#1a001a"
      },
      indigo: {
        100: "#e6e6cc",
        200: "#cccc99",
        300: "#b3b366",
        400: "#999933",
        500: "#808000",
        600: "#666600",
        700: "#4d4d00",
        800: "#333300",
        900: "#1a1a00"
      },
    }
    : {
      grey: {
        100: "#141414",
        200: "#292929",
        300: "#3d3d3d",
        400: "#525252",
        500: "#666666",
        600: "#858585",
        700: "#a3a3a3",
        800: "#c2c2c2",
        900: "#e0e0e0",
      },
      primary: {
        100: "#040509",
        200: "#080b12",
        300: "#0c101b",
        400: "#f2f0f0",
        500: "#141b2d",
        600: "#1F2A40",
        700: "#727681",
        800: "#a1a4ab",
        900: "#d0d1d5",
      },
      greenAccent: {
        100: "#0f2922",
        200: "#1e5245",
        300: "#2e7c67",
        400: "#3da58a",
        500: "#4cceac",
        600: "#70d8bd",
        700: "#94e2cd",
        800: "#b7ebde",
        900: "#dbf5ee",
      },
      redAccent: {
        100: "#2c100f",
        200: "#58201e",
        300: "#832f2c",
        400: "#af3f3b",
        500: "#db4f4a",
        600: "#e2726e",
        700: "#e99592",
        800: "#f1b9b7",
        900: "#f8dcdb",
      },
      blueAccent: {
        100: "#151632",
        200: "#2a2d64",
        300: "#3e4396",
        400: "#535ac8",
        500: "#6870fa",
        600: "#868dfb",
        700: "#a4a9fc",
        800: "#c3c6fd",
        900: "#e1e2fe",
      },
      white: {
        100: "#31312c",
        200: "#626258",
        300: "#939384",
        400: "#c4c4b0",
        500: "#f5f5dc",
        600: "#f7f7e3",
        700: "#f9f9ea",
        800: "#fbfbf1",
        900: "#fdfdf8",
      },
      orange: {
        100: "#331c00",
        200: "#663800",
        300: "#995400",
        400: "#cc7000",
        500: "#ff8c00",
        600: "#ffa333",
        700: "#ffba66",
        800: "#ffd199",
        900: "#ffe8cc",
      },
      pink: {
        100: "#1c092d",
        200: "#37115a",
        300: "#531a88",
        400: "#6e22b5",
        500: "#8a2be2",
        600: "#a155e8",
        700: "#b980ee",
        800: "#d0aaf3",
        900: "#e8d5f9",
      },
      yellow: {
        100: "#332b00",
        200: "#665600",
        300: "#998100",
        400: "#ccac00",
        500: "#ffd700",
        600: "#ffdf33",
        700: "#ffe766",
        800: "#ffef99",
        900: "#fff7cc",
      },
      lavander: {
        100: "#2e2e32",
        200: "#5c5c64",
        300: "#8a8a96",
        400: "#b8b8c8",
        500: "#e6e6fa",
        600: "#ebebfb",
        700: "#f0f0fc",
        800: "#f5f5fd",
        900: "#fafafe",
      },
      purple: {
        100: "#1a001a",
        200: "#330033",
        300: "#4d004d",
        400: "#660066",
        500: "#800080",
        600: "#993399",
        700: "#b366b3",
        800: "#cc99cc",
        900: "#e6cce6",
      },
      indigo: {
        100: "#1a1a00",
        200: "#333300",
        300: "#4d4d00",
        400: "#666600",
        500: "#808000",
        600: "#999933",
        700: "#b3b366",
        800: "#cccc99",
        900: "#e6e6cc",
      },
    }),
});

// mui theme settings
export const themeSettings = (mode) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
          // palette values for dark mode
          primary: {
            main: colors.greenAccent[500],
          },
          secondary: {
            main: colors.greenAccent[500],
          },
          neutral: {
            dark: colors.grey[700],
            main: colors.grey[500],
            light: colors.grey[100],
          },
          background: {
            default: colors.primary[500],
          },
        }
        : {
          // palette values for light mode
          primary: {
            main: colors.primary[100],
          },
          secondary: {
            main: colors.greenAccent[500],
          },
          neutral: {
            dark: colors.grey[700],
            main: colors.grey[500],
            light: colors.grey[100],
          },
          background: {
            default: "#fcfcfc",
          },
        }),
    },
    typography: {
      fontFamily: ["Source Code Pro", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Source Code Pro", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Source Code Pro", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Source Code Pro", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Source Code Pro", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Source Code Pro", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Source Code Pro", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};

// context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => { },
});

export const useMode = () => {
  const [mode, setMode] = useState("dark");
  //get color mode toggle 
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};



// context for nav commands
export const NavComContext = createContext({
  mode: "on",
  toggleNavCom: () => { },
}
);

export const useNav = () => {
  const [mode, setNav] = useState("on");

  //get nav current state and toggle
  const navMode = useMemo(
    () => ({
      mode,
      toggleNavCom: () =>
        setNav((prev) => (prev === "off" ? "on" : "off")),
    }),
    [mode]
  );

  return [navMode];
};