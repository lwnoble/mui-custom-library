import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import Button from '../Components/Button'; 

// Proper import order is important for CSS cascading:
// 1. Mode CSS (dynamically loaded)
// 2. Cognitive CSS (dynamically loaded)
// 3. Platform CSS (dynamically loaded)
// 4. Other specific CSS files
import '../styles/theme-files/surface-containers.css';
import '../styles/theme-files/sizing-spacing.css';
import '../styles/theme-files/shadow-levels.css';
// 5. System CSS should be loaded last to provide overrides
import '../styles/theme-files/system.css';

const MockPage = () => {
  const [currentMode, setCurrentMode] = useState('AA-light');
  const [currentPlatform, setCurrentPlatform] = useState('desktop');
  const [currentBackground, setCurrentBackground] = useState('default');
  const [currentCognitiveProfile, setCognitiveProfile] = useState('none');

  // Function to load a CSS file dynamically
  const loadStylesheet = (fileName, id) => {
    return new Promise((resolve, reject) => {
      // Check if the stylesheet is already loaded
      if (document.getElementById(id)) {
        resolve();
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = fileName;
      link.id = id;

      link.onload = () => {
        resolve();
      };

      link.onerror = () => {
        reject(new Error(`Failed to load ${fileName}`));
      };

      document.head.appendChild(link);
    });
  };

  // Function to unload a CSS file
  const unloadStylesheet = (id) => {
    const stylesheet = document.getElementById(id);
    if (stylesheet) {
      document.head.removeChild(stylesheet);
    }
  };

  // Load CSS files in the proper order
  useEffect(() => {
    const loadThemeFiles = async () => {
      try {
        // 1. Load mode-specific CSS first
        await loadStylesheet(
          `../styles/theme-files/mode-${currentMode.toLowerCase()}.css`, 
          `theme-mode-${currentMode}`
        );

        // 2. Load cognitive profile CSS (if not 'none')
        if (currentCognitiveProfile !== 'none') {
          await loadStylesheet(
            `../styles/theme-files/cognitive-${currentCognitiveProfile.toLowerCase()}.css`,
            `theme-cognitive-${currentCognitiveProfile}`
          );
        }

        // 3. Load platform-specific CSS
        await loadStylesheet(
          `../styles/theme-files/platform-${currentPlatform.toLowerCase()}.css`, 
          `theme-platform-${currentPlatform}`
        );

        // Set data attributes on document root
        document.documentElement.setAttribute('data-mode', currentMode);
        document.documentElement.setAttribute('data-platform', currentPlatform);
        document.documentElement.setAttribute('data-cognitive-profile', currentCognitiveProfile);
      } catch (error) {
        console.error('Error loading theme files:', error);
      }
    };

    loadThemeFiles();

    // Cleanup function
    return () => {
      // We might not want to remove these on unmount
      // as they might be needed globally
    };
  }, [currentMode, currentPlatform, currentCognitiveProfile]);

  // Function to change cognitive profile
  const changeCognitiveProfile = (profile) => {
    // If trying to set the same profile, do nothing
    if (profile === currentCognitiveProfile) return;
    
    // Unload the current cognitive profile stylesheet (if not 'none')
    if (currentCognitiveProfile !== 'none') {
      unloadStylesheet(`theme-cognitive-${currentCognitiveProfile}`);
    }
    
    // Update the cognitive profile state
    setCognitiveProfile(profile);
  };

  // Toggle between light and dark modes
  const toggleMode = () => {
    // Remove previous mode stylesheet
    unloadStylesheet(`theme-mode-${currentMode}`);
    
    const newMode = currentMode === 'AA-light' ? 'AA-dark' : 'AA-light';
    setCurrentMode(newMode);
  };

  // Change platform
  const togglePlatform = () => {
    // Remove previous platform stylesheet
    unloadStylesheet(`theme-platform-${currentPlatform}`);
    
    const platforms = ['desktop', 'mobile', 'tablet'];
    const currentIndex = platforms.indexOf(currentPlatform);
    const nextIndex = (currentIndex + 1) % platforms.length;
    setCurrentPlatform(platforms[nextIndex]);
  };

  // Change background
  const changeBackground = (background) => {
    setCurrentBackground(background);
  };

  // Cycle through cognitive profiles
  const cycleCognitiveProfile = () => {
    const profiles = ['none', 'adhd', 'dyslexia'];
    const currentIndex = profiles.indexOf(currentCognitiveProfile);
    const nextIndex = (currentIndex + 1) % profiles.length;
    changeCognitiveProfile(profiles[nextIndex]);
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        transition: 'all 0.3s ease',
        pb: 8
      }}
    >
      {/* Header with theme controls */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 2, 
          mb: 4,
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}
        data-background={currentBackground}
      >
        <Container>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom>
                Design System Mock Page
              </Typography>
              <Typography variant="body1">
                Current Mode: {currentMode} | Platform: {currentPlatform} | Background: {currentBackground} | Cognitive: {currentCognitiveProfile}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button onClick={toggleMode}>
                  Switch to {currentMode === 'AA-light' ? 'Dark' : 'Light'} Mode
                </Button>
                <Button onClick={togglePlatform}>
                  Cycle Platform ({currentPlatform})
                </Button>
                <Button variant="outlined" onClick={cycleCognitiveProfile}>
                  Cycle Cognitive Profile
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Paper>

      {/* Main content */}
      <Container>
        {/* Cognitive profile selector */}
        <Paper sx={{ p: 3, mb: 4 }} data-background={currentBackground}>
          <Typography variant="h5" gutterBottom>
            Cognitive Profiles
          </Typography>
          <Grid container spacing={2}>
            {['none', 'adhd', 'dyslexia'].map((profile) => (
              <Grid item key={profile}>
                <Button 
                  variant={profile === currentCognitiveProfile ? 'contained' : 'outlined'}
                  onClick={() => changeCognitiveProfile(profile)}
                >
                  {profile === 'none' ? 'Standard' : profile.toUpperCase()}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Background selector */}
        <Paper sx={{ p: 3, mb: 4 }} data-background={currentBackground}>
          <Typography variant="h5" gutterBottom>
            Background Surfaces
          </Typography>
          <Grid container spacing={2}>
            {['default', 'primary', 'secondary', 'tertiary', 'error', 'neutral'].map((bg) => (
              <Grid item key={bg}>
                <Button 
                  variant={bg === currentBackground ? 'contained' : 'outlined'}
                  onClick={() => changeBackground(bg)}
                >
                  {bg.charAt(0).toUpperCase() + bg.slice(1)}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Button showcase */}
        <Paper sx={{ p: 3, mb: 4 }} data-background={currentBackground}>
          <Typography variant="h5" gutterBottom>
            Button Variants
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Contained
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button variant="contained" size="large">Large Button</Button>
                <Button variant="contained">Medium Button</Button>
                <Button variant="contained" size="small">Small Button</Button>
                <Button variant="contained" disabled>Disabled Button</Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Outlined
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button variant="outlined" size="large">Large Button</Button>
                <Button variant="outlined">Medium Button</Button>
                <Button variant="outlined" size="small">Small Button</Button>
                <Button variant="outlined" disabled>Disabled Button</Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Text
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button variant="text" size="large">Large Button</Button>
                <Button variant="text">Medium Button</Button>
                <Button variant="text" size="small">Small Button</Button>
                <Button variant="text" disabled>Disabled Button</Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Surface container showcase */}
        <Paper sx={{ p: 3, mb: 4 }} data-background={currentBackground}>
          <Typography variant="h5" gutterBottom>
            Surface Containers
          </Typography>
          <Grid container spacing={3}>
            {['default', 'low', 'lowest', 'high', 'highest'].map((container) => (
              <Grid item xs={12} sm={6} md={4} key={container}>
                <Paper 
                  sx={{ 
                    p: 3, 
                    height: 150, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: 2
                  }}
                  data-surfaceContainer={container === 'default' ? undefined : container}
                >
                  <Typography variant="subtitle1">
                    {container.charAt(0).toUpperCase() + container.slice(1)} Container
                  </Typography>
                  <Button variant="contained">Button</Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>
        
        {/* Shadow levels showcase */}
        <Paper sx={{ p: 3, mb: 4 }} data-background={currentBackground}>
          <Typography variant="h5" gutterBottom>
            Shadow Levels
          </Typography>
          <Grid container spacing={3}>
            {[0, 1, 2, 3, 4, 5].map((level) => (
              <Grid item xs={12} sm={6} md={4} key={level}>
                <Paper 
                  sx={{ 
                    p: 3, 
                    height: 150, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexDirection: 'column'
                  }}
                  data-shadow={level}
                >
                  <Typography variant="subtitle1">
                    Shadow Level {level}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Platform-specific content showcase */}
        <Paper sx={{ p: 3, mb: 4 }} data-background={currentBackground}>
          <Typography variant="h5" gutterBottom>
            Platform-Specific Content
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper 
                sx={{ 
                  p: 3, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  height: 200
                }}
              >
                <Typography variant="subtitle1" sx={{ display: 'var(--Desktop)' }}>
                  This content is only visible on Desktop
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper 
                sx={{ 
                  p: 3, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  height: 200
                }}
              >
                <Typography variant="subtitle1" sx={{ display: 'var(--Mobile)' }}>
                  This content is only visible on Mobile
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper 
                sx={{ 
                  p: 3, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  height: 200
                }}
              >
                <Typography variant="subtitle1" sx={{ display: 'var(--Tablet)' }}>
                  This content is only visible on Tablet
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default MockPage;