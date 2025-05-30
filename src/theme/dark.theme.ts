// theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
   typography: {
    fontFamily: [
      'Gotham',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ff4b9b',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            color: '#ff4b9b',
          },
        },
      },
    },
  },
});

export default theme;
