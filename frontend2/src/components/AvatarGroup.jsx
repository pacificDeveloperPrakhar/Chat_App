import Avatar from './AvatarOnline&Offline';
import AvatarGroup from '@mui/material/AvatarGroup';
import { styled } from '@mui/material/styles';
import { Badge } from '@mui/material';
import { useSelector } from 'react-redux';


const TotalUserBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.primary.main, 
    color: 'white',
    fontSize: '0.75rem',
    padding: '0.5rem',
    borderRadius: '50%',
  },
}));

export default function TotalAvatars({ users, toberendered }) {
  const user = useSelector((state) => state.user.user);

  function needToRender(users, toberendered) {
    const participantUsers = users.filter((u) => u.id !== user.id);
    const isGroup = toberendered.isGroup;
    return {
      isGroup,
      users: participantUsers,
    };
  }

  const info = needToRender(users, toberendered);

  return (
    <>
      {info.isGroup ? (
        <div>
      
          <TotalUserBadge
            badgeContent={info.users.length + 1}
            color="primary"
          >
            <Avatar
              username={"+30"}
              src={info.users[0]?.profileUrl || toberendered.profileImage} 
              online={false} 
            />
          </TotalUserBadge>
        </div>
      ) : (
        <div className="-my-1">
          <Avatar
            username={info.users[0]?.username || toberendered.usernames[0]}
            src={info.users[0]?.profileUrl || toberendered.profileImage[0]}
            online={info.users[0]?.userStatus === 'active'}
          />
        </div>
      )}
    </>
  );
}
