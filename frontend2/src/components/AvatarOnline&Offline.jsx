import * as React from 'react';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',  // Green color for online
    color: '#44b700',
    boxShadow: '0 0 0 2px rgba(0, 0, 0, 0)', // Remove the white outline by making it transparent
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',  // Ripple animation
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

export default function OnlineBadgeAvatar({online=false}) {
  return (<>
  {
      online?<StyledBadge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      variant="dot"
      >
      <Avatar alt="Online User" src="/static/images/avatar/1.jpg" />
      </StyledBadge>:<Avatar alt="Online User" src="/static/images/avatar/1.jpg" />
    }
    </>
  );
}
