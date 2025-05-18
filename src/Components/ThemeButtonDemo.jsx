// src/Components/ThemeButtonDemo.jsx
import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { Button } from './Buttons.jsx';

// Modified version that accepts props instead of managing internal state
const ThemeButtonDemo = ({ 
  // Props that replace internal state
  currentMode = 'AA-light',
  currentPlatform = 'desktop',
  currentCognitive = 'none',
  currentBackground = 'default',
  // Functions for changing theme settings
  onToggleMode,
  onCyclePlatform,
  onCycleCognitiveProfile,
  onSetBackground
}) => {
  // Parse the mode to display in UI
  const modeDetails = currentMode.split('-');
  const wcagLevel = modeDetails[0];
  const colorScheme = modeDetails[1] || 'light';
  
  return (
    <Box sx={{ p: 4, minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom>
        Theme Button Demo
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" paragraph>
          Current Mode: {currentMode} | Platform: {currentPlatform} | Cognitive: {currentCognitive}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button onClick={onToggleMode}>
            Switch to {colorScheme === 'light' ? 'Dark' : 'Light'} Mode
          </Button>
          <Button onClick={onCyclePlatform}>
            Cycle Platform
          </Button>
          <Button variant="outlined" onClick={onCycleCognitiveProfile}>
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
              variant={bg === currentBackground ? 'contained' : 'outlined'}
              onClick={() => onSetBackground(bg)}
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