import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { Button } from './Buttons.jsx'

// Import only index.css - all other CSS files will be loaded dynamically
// import '../index.css';

const ThemeButtonDemo = () => {
  const [mode, setMode] = useState('AA-light');
  const [platform, setPlatform] = useState('desktop');
  const [cognitiveProfile, setCognitiveProfile] = useState('none');
  const [background, setBackground] = useState('default');

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

      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to load ${fileName}`));

      document.head.appendChild(link);
    });
  };

  // Function to unload a stylesheet
  const unloadStylesheet = (id) => {
    const stylesheet = document.getElementById(id);
    if (stylesheet) {
      document.head.removeChild(stylesheet);
    }
  };

  // Load initial CSS files only once
  useEffect(() => {
    const loadInitialCss = async () => {
      try {
        // Load these in order - they don't change with settings
        await loadStylesheet('styles/theme-files/surface-containers.css', 'surface-containers');
        await loadStylesheet('styles/theme-files/sizing-spacing.css', 'sizing-spacing');
        await loadStylesheet('styles/theme-files/shadow-levels.css', 'shadow-levels');
        await loadStylesheet('styles/theme-files/system.css', 'system');
      } catch (error) {
        console.error('Error loading initial CSS files:', error);
      }
    };

    loadInitialCss();
  }, []);

  // Load dynamic CSS files when settings change
  useEffect(() => {
    const loadDynamicCss = async () => {
      try {
        // 1. Load mode-specific CSS first
        await loadStylesheet(
          `styles/theme-files/mode-${mode.toLowerCase()}.css`,
          `theme-mode-${mode}`
        );

        // 2. Load cognitive profile CSS if not 'none'
        if (cognitiveProfile !== 'none') {
          await loadStylesheet(
            `styles/theme-files/cognitive-${cognitiveProfile.toLowerCase()}.css`,
            `theme-cognitive-${cognitiveProfile}`
          );
        }

        // 3. Load platform-specific CSS
        await loadStylesheet(
          `styles/theme-files/platform-${platform.toLowerCase()}.css`,
          `theme-platform-${platform}`
        );

        // Set data attributes on document root
        document.documentElement.setAttribute('data-mode', mode);
        document.documentElement.setAttribute('data-platform', platform);
        document.documentElement.setAttribute('data-cognitive-profile', cognitiveProfile);
      } catch (error) {
        console.error('Error loading dynamic CSS files:', error);
      }
    };

    loadDynamicCss();

    // Cleanup function to remove specific stylesheets when component unmounts
    return () => {
      unloadStylesheet(`theme-mode-${mode}`);
      if (cognitiveProfile !== 'none') {
        unloadStylesheet(`theme-cognitive-${cognitiveProfile}`);
      }
      unloadStylesheet(`theme-platform-${platform}`);
    };
  }, [mode, platform, cognitiveProfile]);

  // Toggle between light and dark modes
  const toggleMode = () => {
    unloadStylesheet(`theme-mode-${mode}`);
    setMode(mode === 'AA-light' ? 'AA-dark' : 'AA-light');
  };

  // Cycle through platforms
  const cyclePlatform = () => {
    unloadStylesheet(`theme-platform-${platform}`);
    const platforms = ['desktop', 'mobile', 'tablet'];
    const currentIndex = platforms.indexOf(platform);
    const nextIndex = (currentIndex + 1) % platforms.length;
    setPlatform(platforms[nextIndex]);
  };

  // Cycle through cognitive profiles
  const cycleCognitiveProfile = () => {
    if (cognitiveProfile !== 'none') {
      unloadStylesheet(`theme-cognitive-${cognitiveProfile}`);
    }
    const profiles = ['none', 'adhd', 'dyslexia'];
    const currentIndex = profiles.indexOf(cognitiveProfile);
    const nextIndex = (currentIndex + 1) % profiles.length;
    setCognitiveProfile(profiles[nextIndex]);
  };

  return (
    <Box sx={{ p: 4, minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom>
        Theme Button Demo
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" paragraph>
          Current Mode: {mode} | Platform: {platform} | Cognitive: {cognitiveProfile}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button onClick={toggleMode}>
            Switch to {mode === 'AA-light' ? 'Dark' : 'Light'} Mode
          </Button>
          <Button onClick={cyclePlatform}>
            Cycle Platform
          </Button>
          <Button variant="outlined" onClick={cycleCognitiveProfile}>
            Cycle Cognitive Profile
          </Button>
        </Box>
      </Box>
      
      <Typography variant="h5" gutterBottom>
        Button Variants
      </Typography>
      
      <Grid container spacing={4} sx={{ mb: 4 }}>
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
      
      <Typography variant="h5" gutterBottom>
        Background Surfaces
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {['default', 'primary', 'secondary', 'tertiary', 'error', 'neutral'].map((bg) => (
          <Grid item key={bg}>
            <Button 
              variant={bg === background ? 'contained' : 'outlined'}
              onClick={() => setBackground(bg)}
            >
              {bg.charAt(0).toUpperCase() + bg.slice(1)}
            </Button>
          </Grid>
        ))}
      </Grid>
      
      <Typography variant="h5" gutterBottom>
        Surfaces with Different Backgrounds
      </Typography>
      
      <Grid container spacing={3}>
        {['default', 'primary', 'secondary', 'tertiary', 'error', 'neutral'].map((bg) => (
          <Grid item xs={12} sm={6} md={4} key={bg}>
            <Paper 
              sx={{ p: 3, height: 200 }}
              data-background={bg}
            >
              <Typography variant="h6" gutterBottom>
                {bg.charAt(0).toUpperCase() + bg.slice(1)} Background
              </Typography>
              <Button variant="contained">Button</Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ThemeButtonDemo;