import React, { useState } from "react";
import { useSelector } from "react-redux";
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-dot': {
    backgroundColor: '#44b700',
    color: '#44b700',
  },
  '& .MuiBadge-dotOffline': {
    backgroundColor: '#f44336',
    color: '#f44336',
  },
}));

const ContactList = ({ onParticipantSelect }) => {
  const users = useSelector(state => state.user.users); // List of all users
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  const handleSelect = (participant) => {
    const alreadySelected = selectedParticipants.some(p => p.id === participant.id);

    if (alreadySelected) {
      setSelectedParticipants(selectedParticipants.filter(p => p.id !== participant.id));
    } else {
      setSelectedParticipants([...selectedParticipants, participant]);
    }

    onParticipantSelect([...selectedParticipants, participant]);
  };

  const getOnlineStatus = (user) => {
    return user.userStatus === "active" ? 'dot' : 'dotOffline';
  };

  return (
    <div className="w-1/4 bg-gray-100 p-4">
      <h2 className="text-xl font-bold mb-4">Contacts</h2>
      <ul>
        {users?.map((participant) => (
          <li
            key={participant.id}
            onClick={() => handleSelect(participant)}
            className={`p-2 cursor-pointer rounded-lg mb-2 flex items-center ${
              selectedParticipants.some(p => p.id === participant.id)
                ? 'bg-orange-600 text-white'
                : 'bg-white text-black'
            }`}
          >
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant={getOnlineStatus(participant)}
            >
              <Avatar alt={participant.username} src={participant.profileUrl} />
            </StyledBadge>
            <span className="ml-2">{participant.username}</span>
          </li>
        ))}
      </ul>

      {/* Start Chat Button */}
      {selectedParticipants.length > 0 && (
        <div className="mt-4">
          <button
            className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-300"
            onClick={() => onParticipantSelect(selectedParticipants)}
          >
            {selectedParticipants.length === 1 ? 'Start Chat' : 'Create Group Chat'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ContactList;
