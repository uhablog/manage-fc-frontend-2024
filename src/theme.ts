'use client';
import { Roboto } from "next/font/google";
import { createTheme } from '@mui/material/styles';

const roboto = Roboto({
  weight: ['300', '400' , '500', '700'],
  subsets: ['latin'],
  display: 'swap'
});

let theme = createTheme({
  typography: {
    fontFamily: roboto.style.fontFamily
  }
});

theme = createTheme(theme, {
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          [theme.breakpoints.down('sm')]: {
            fontSize: '0.9rem',
          },
        },
      },
    },
  },
  typography: {
    body1: {
      ...theme.typography.body1,
      [theme.breakpoints.down('sm')]: {
        fontSize: '0.8rem',
      },
    },
    body2: {
      ...theme.typography.body2,
      [theme.breakpoints.down('sm')]: {
        fontSize: '0.7rem',
      },
    },
    h4: {
      ...theme.typography.h4,
      [theme.breakpoints.down('sm')]: {
        fontSize: '1.5rem',
      },
    },
    h6: {
      ...theme.typography.h6,
      [theme.breakpoints.down('sm')]: {
        fontSize: '1.0rem',
      },
    },
    // 必要に応じて他の見出しも同様に調整
  },
});

export default theme;