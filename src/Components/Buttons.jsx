import React from 'react';
import { styled } from '@mui/material/styles';
import MuiButton from '@mui/material/Button';

// Create a styled version of the MUI Button that uses your CSS variables
const StyledButton = styled(MuiButton)(({ theme, variant, size }) => ({
  // Use the CSS variables for styling
  backgroundColor: variant === 'contained' ? 'var(--Button, #1976d2)' : 'transparent',
  color: variant === 'contained' ? 'var(--On-Button, #ffffff)' : 'var(--Button, #1976d2)',
  
  // Size adjustments
  height: size === 'small' ? 'var(--Button-Small-Height, 32px)' : 'var(--Button-Height, 40px)',
  minWidth: 'var(--Button-Minimum-Width, 64px)',
  padding: size === 'small' 
    ? 'var(--Button-Small-Horizontal-Padding, 8px)' 
    : 'var(--Button-Horizontal-Padding, 16px)',
  
  // Border radius
  borderRadius: 'var(--Button-Border-Radius, 4px)',
  
  // For outlined buttons
  border: variant === 'outlined' ? '1px solid var(--Button, #1976d2)' : 'none',
  
  // Focus style
  '&:focus-visible': {
    outline: 'none',
    boxShadow: '0 0 0 3px var(--Focus-Outline, rgba(25, 118, 210, 0.5))'
  },
  
  // Transitions
  transition: 'background-color 0.2s, box-shadow 0.2s, color 0.2s',
}));

/**
 * Button component that uses design system CSS variables
 */
export const Button = React.forwardRef((props, ref) => {
  const { 
    children, 
    variant = 'contained',
    size = 'medium',
    ...other 
  } = props;
  
  return (
    <StyledButton
      ref={ref}
      variant={variant}
      size={size}
      {...other}
    >
      {children}
    </StyledButton>
  );
});
