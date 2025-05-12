import React, { useState, useEffect } from 'react';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import usePlatform from './hooks/usePlatform';
import './styles/base.css';

// Components icons
import ButtonIcon from '@mui/icons-material/SmartButton';
import TextFieldIcon from '@mui/icons-material/TextFields';
import CardIcon from '@mui/icons-material/ViewAgenda';
import TableIcon from '@mui/icons-material/TableChart';
import DialogIcon from '@mui/icons-material/Message';
import ListIcon from '@mui/icons-material/List';
import TabsIcon from '@mui/icons-material/Tab';
import AlertIcon from '@mui/icons-material/Announcement';
import ChipIcon from '@mui/icons-material/Chip';
import TooltipIcon from '@mui/icons-material/Info';

// Width of the left navigation drawer
const drawerWidth = 240;

// Custom styled button using CSS variables
const MuiButton = styled(Button)(({ theme }) => ({
  height: 'var(--Button-Height)',
  minWidth: 'var(--Button-Minimum-Width)',
  borderRadius: 'var(--Button-Border-Radius)',
  padding: '0 var(--Button-Horizontal-Padding)',
  backgroundColor: 'var(--Button)',
  color: 'var(--On-Button)',
  '&:hover': {
    backgroundColor: 'var(--Button-Half)'
  },
  '&.MuiButton-sizeSmall': {
    height: 'var(--Button-Small-Height)',
    padding: '0 var(--Button-Small-Horizontal-Padding)',
  },
}));

// Component library items
const components = [
  { name: 'Buttons', icon: <ButtonIcon /> },
  { name: 'Text Fields', icon: <TextFieldIcon /> },
  { name: 'Cards', icon: <CardIcon /> },
  { name: 'Tables', icon: <TableIcon /> },
  { name: 'Dialogs', icon: <DialogIcon /> },
  { name: 'Lists', icon: <ListIcon /> },
  { name: 'Tabs', icon: <TabsIcon /> },
  { name: 'Alerts', icon: <AlertIcon /> },
  { name: 'Chips', icon: <ChipIcon /> },
  { name: 'Tooltips', icon: <TooltipIcon /> }
];

// Available modes
const modes = ['AA-dark', 'AA-light'];

// Available backgrounds
const backgrounds = [
  'default',
  'primary',
  'primary-light',
  'primary-dark',
  'secondary',
  'secondary-light',
  'secondary-dark',
  'tertiary',
  'tertiary-light',
  'tertiary-dark',
  'white',
  'grey',
  'black'
];

// Available cognitive settings
const cognitiveSettings = ['Default', 'High Contrast', 'Reduced Motion', 'Focus Mode'];

export default function ComponentLibrary() {
  const platform = usePlatform();
  const [mode, setMode] = useState('AA-dark');
  const [background, setBackground] = useState('default');
  const [cognitive, setCognitive] = useState('Default');
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState('Buttons');

  // Effect to apply theme settings via data attributes and CSS loading
  useEffect(() => {
    // Set data attributes on document root
    document.documentElement.setAttribute('data-mode', mode);
    document.documentElement.setAttribute('data-platform', platform);
    document.documentElement.setAttribute('data-background', background);
    document.documentElement.setAttribute('data-cognitive', cognitive.toLowerCase());
    
    // Load mode-specific CSS
    const modeLink = document.createElement('link');
    modeLink.rel = 'stylesheet';
    modeLink.href = `/styles/mode-${mode.toLowerCase()}.css`;
    modeLink.id = 'theme-mode-css';
    
    // Remove existing mode CSS if it exists
    const existingModeLink = document.getElementById('theme-mode-css');
    if (existingModeLink) {
      document.head.removeChild(existingModeLink);
    }
    
    document.head.appendChild(modeLink);
    
    return () => {
      // Cleanup when component unmounts
      if (document.getElementById('theme-mode-css')) {
        document.head.removeChild(document.getElementById('theme-mode-css'));
      }
    };
  }, [mode, background, cognitive, platform]);

  // Handle component selection
  const handleComponentSelect = (componentName) => {
    setSelectedComponent(componentName);
    if (window.innerWidth < 600) {
      setLeftDrawerOpen(false);
    }
  };

  // Toggle settings panel
  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen);
  };

  // Toggle left drawer on mobile
  const toggleLeftDrawer = () => {
    setLeftDrawerOpen(!leftDrawerOpen);
  };

  // Create the content area based on selected component
  const renderComponentContent = () => {
    switch (selectedComponent) {
      case 'Buttons':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Buttons</Typography>
            <Typography variant="body1" paragraph>
              Buttons allow users to take actions with a single tap. They communicate actions that users can take.
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Button Variants</Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
              <MuiButton variant="contained">Contained</MuiButton>
              <MuiButton variant="outlined">Outlined</MuiButton>
              <MuiButton variant="text">Text</MuiButton>
            </Box>
            
            <Typography variant="h6" gutterBottom>Button Sizes</Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
              <MuiButton variant="contained" size="small">Small</MuiButton>
              <MuiButton variant="contained">Medium</MuiButton>
              <MuiButton variant="contained" size="large">Large</MuiButton>
            </Box>
            
            <Typography variant="h6" gutterBottom>Disabled Buttons</Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <MuiButton variant="contained" disabled>Disabled</MuiButton>
              <MuiButton variant="outlined" disabled>Disabled</MuiButton>
              <MuiButton variant="text" disabled>Disabled</MuiButton>
            </Box>
          </Box>
        );
      default:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>{selectedComponent}</Typography>
            <Typography variant="body1">
              This component is coming soon. Please check back later!
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex' }} data-compnent="surface">
      <CssBaseline />
      
      {/* Top navigation bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'var(--Container)',
          color: 'var(--On-Color)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle menu"
            edge="start"
            onClick={toggleLeftDrawer}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Component Library
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            Platform: {platform}
          </Typography>
          <IconButton color="inherit" onClick={toggleSettings} aria-label="open settings">
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      {/* Left navigation drawer */}
      <Drawer
        variant="persistent"
        open={leftDrawerOpen}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: 'var(--Container-Low)',
            color: 'var(--On-Color)',
            borderRight: '1px solid var(--Surface-Border)'
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <List>
            {components.map((component) => (
              <ListItem 
                button 
                key={component.name}
                selected={selectedComponent === component.name}
                onClick={() => handleComponentSelect(component.name)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'var(--Button-Half)',
                  },
                  '&.Mui-selected:hover': {
                    backgroundColor: 'var(--Button-Half)',
                  },
                  '&:hover': {
                    backgroundColor: 'var(--Button-Half)',
                  }
                }}
              >
                <ListItemIcon sx={{ color: 'var(--Icon-Primary)' }}>
                  {component.icon}
                </ListItemIcon>
                <ListItemText primary={component.name} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      
      {/* Settings drawer on the right */}
      <Drawer
        anchor="right"
        open={settingsOpen}
        onClose={toggleSettings}
        sx={{
          '& .MuiDrawer-paper': {
            width: 300,
            backgroundColor: 'var(--Container)',
            color: 'var(--On-Color)',
            p: 2
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Settings</Typography>
          <IconButton onClick={toggleSettings} sx={{ color: 'var(--Icon-Primary)' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Divider sx={{ mb: 3, borderColor: 'var(--Surface-Border)' }} />
        
        <FormControl fullWidth margin="normal">
          <InputLabel id="mode-select-label">Theme Mode</InputLabel>
          <Select
            labelId="mode-select-label"
            value={mode}
            label="Theme Mode"
            onChange={(e) => setMode(e.target.value)}
          >
            {modes.map((m) => (
              <MenuItem key={m} value={m}>{m}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl fullWidth margin="normal">
          <InputLabel id="background-select-label">Background</InputLabel>
          <Select
            labelId="background-select-label"
            value={background}
            label="Background"
            onChange={(e) => setBackground(e.target.value)}
          >
            {backgrounds.map((bg) => (
              <MenuItem key={bg} value={bg}>{bg}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl fullWidth margin="normal">
          <FormLabel id="cognitive-settings-label">Cognitive Settings</FormLabel>
          <RadioGroup
            aria-labelledby="cognitive-settings-label"
            value={cognitive}
            onChange={(e) => setCognitive(e.target.value)}
          >
            {cognitiveSettings.map((setting) => (
              <FormControlLabel key={setting} value={setting} control={<Radio />} label={setting} />
            ))}
          </RadioGroup>
        </FormControl>
        
        <Card sx={{ mt: 3, backgroundColor: 'var(--Container-High)' }}>
          <CardContent>
            <Typography variant="subtitle2" color="var(--Surface-Quiet)">Current Settings</Typography>
            <Typography variant="body2">Mode: {mode}</Typography>
            <Typography variant="body2">Background: {background}</Typography>
            <Typography variant="body2">Platform: {platform}</Typography>
            <Typography variant="body2">Cognitive: {cognitive}</Typography>
          </CardContent>
        </Card>
      </Drawer>
      
      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: { sm: `calc(100% - ${leftDrawerOpen ? drawerWidth : 0}px)` },
          ml: { sm: leftDrawerOpen ? `${drawerWidth}px` : 0 },
          transition: 'margin 0.2s ease-in-out'
        }}
      >
        <Toolbar /> {/* This creates space below the app bar */}
        {renderComponentContent()}
      </Box>
    </Box>
  );
}