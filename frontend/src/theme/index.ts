import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00d4aa', // Softer teal green
      light: '#4dd8c7',
      dark: '#009688',
    },
    secondary: {
      main: '#ff7043', // Softer orange
      light: '#ffab91',
      dark: '#e64a19',
    },
    background: {
      default: '#0a0a0a',
      paper: 'rgba(0, 212, 170, 0.03)',
    },
    text: {
      primary: '#e0e0e0',
      secondary: 'rgba(224, 224, 224, 0.7)',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    success: {
      main: '#4caf50',
    },
    info: {
      main: '#2196f3',
    },
  },
  typography: {
    fontFamily: '"IBM Plex Mono", "IBM Plex Sans", "Courier New", monospace',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
      fontFamily: '"IBM Plex Mono", monospace',
      letterSpacing: '0.05em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      fontFamily: '"IBM Plex Mono", monospace',
      letterSpacing: '0.03em',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      fontFamily: '"IBM Plex Mono", monospace',
      letterSpacing: '0.03em',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
      fontFamily: '"IBM Plex Mono", monospace',
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
      fontFamily: '"IBM Plex Mono", monospace',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.4,
      fontFamily: '"IBM Plex Mono", monospace',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      fontFamily: '"IBM Plex Sans", sans-serif',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      fontFamily: '"IBM Plex Sans", sans-serif',
    },
    button: {
      fontFamily: '"IBM Plex Mono", monospace',
      fontWeight: 600,
      letterSpacing: '0.03em',
    },
    caption: {
      fontFamily: '"IBM Plex Mono", monospace',
      fontSize: '0.75rem',
    },
    overline: {
      fontFamily: '"IBM Plex Mono", monospace',
      fontSize: '0.75rem',
      fontWeight: 600,
      letterSpacing: '0.05em',
    },
  },
  shape: {
    borderRadius: 8, // Slightly more rounded
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '12px 24px',
          fontWeight: 600,
          fontFamily: '"IBM Plex Mono", monospace',
          letterSpacing: '0.03em',
          border: '1px solid',
          transition: 'all 0.2s ease',
        },
        contained: {
          background: 'linear-gradient(135deg, #00d4aa 0%, #4dd8c7 100%)',
          borderColor: 'transparent',
          color: '#000',
          boxShadow: '0 2px 8px rgba(0, 212, 170, 0.2)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4dd8c7 0%, #00d4aa 100%)',
            boxShadow: '0 4px 16px rgba(0, 212, 170, 0.3)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderColor: '#00d4aa',
          color: '#00d4aa',
          '&:hover': {
            borderColor: '#4dd8c7',
            backgroundColor: 'rgba(0, 212, 170, 0.05)',
            boxShadow: '0 2px 8px rgba(0, 212, 170, 0.2)',
          },
        },
        text: {
          color: '#00d4aa',
          '&:hover': {
            backgroundColor: 'rgba(0, 212, 170, 0.05)',
            boxShadow: '0 2px 8px rgba(0, 212, 170, 0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.04)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: '"IBM Plex Mono", monospace',
          fontWeight: 600,
          letterSpacing: '0.03em',
          border: '1px solid',
          '&.MuiChip-outlined': {
            borderColor: 'rgba(0, 212, 170, 0.4)',
            color: '#00d4aa',
            '&:hover': {
              borderColor: '#00d4aa',
              backgroundColor: 'rgba(0, 212, 170, 0.05)',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          fontFamily: '"IBM Plex Mono", monospace',
          '& .MuiSelect-select': {
            fontFamily: '"IBM Plex Mono", monospace',
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: '"IBM Plex Mono", monospace',
          '&:hover': {
            backgroundColor: 'rgba(0, 212, 170, 0.05)',
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            fontFamily: '"IBM Plex Mono", monospace',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          fontFamily: '"IBM Plex Sans", sans-serif',
          border: '1px solid',
          '&.MuiAlert-error': {
            borderColor: 'rgba(244, 67, 54, 0.3)',
            backgroundColor: 'rgba(244, 67, 54, 0.05)',
          },
          '&.MuiAlert-success': {
            borderColor: 'rgba(76, 175, 80, 0.3)',
            backgroundColor: 'rgba(76, 175, 80, 0.05)',
          },
          '&.MuiAlert-warning': {
            borderColor: 'rgba(255, 152, 0, 0.3)',
            backgroundColor: 'rgba(255, 152, 0, 0.05)',
          },
          '&.MuiAlert-info': {
            borderColor: 'rgba(33, 150, 243, 0.3)',
            backgroundColor: 'rgba(33, 150, 243, 0.05)',
          },
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: '#00d4aa',
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 212, 170, 0.1)',
          '& .MuiLinearProgress-bar': {
            backgroundColor: '#00d4aa',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 212, 170, 0.1)',
          border: '2px solid rgba(0, 212, 170, 0.3)',
        },
      },
    },
  },
});
