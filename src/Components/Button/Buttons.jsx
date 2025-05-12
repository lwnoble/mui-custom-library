import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

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
  '&.MuiButton-outlined': {
    backgroundColor: 'transparent',
    borderColor: 'var(--Button)',
    color: 'var(--Button)',
    '&:hover': {
      backgroundColor: 'var(--Button-Half)',
      color: 'var(--On-Button)',
    },
  },
  '&.MuiButton-text': {
    backgroundColor: 'transparent',
    color: 'var(--Button)',
    '&:hover': {
      backgroundColor: 'var(--Button-Half)',
      color: 'var(--On-Button)',
    },
  },
}));

export default MuiButton;