import Avatar from './AvatarOnline&Offline';
import AvatarGroup from '@mui/material/AvatarGroup';
import { styled } from '@mui/material/styles';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
const StyledAvatarGroup = styled(AvatarGroup)({
  '& .MuiAvatar-root': {
    margin: '-2rem', // Adjust this value to make the avatars closer or farther
  },
});

export default function TotalAvatars({users,toberendered}) {
  const user=useSelector(state=>state.user.user)
  function needToRender(users,toberendered){
    const participantUsers=users.filter(u=>u.id!=user.id);
    const isGroup=toberendered.isGroup;
    return({
      isGroup,
      users:participantUsers
    })
  }
  const info=needToRender(users,toberendered)
  return (
    <>
    {
      
      
       info.isGroup?
        <StyledAvatarGroup total={users.length}>
        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
        <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
        </StyledAvatarGroup>
      :
      <>
      <div className="-my-1">
      <Avatar username={info.users[0].username} src={info.users[0].profileUrl} online={info.users?.[0].userStatus=="active"?true:false}/>
      </div>
      </>
  }
  </>
  );
}
