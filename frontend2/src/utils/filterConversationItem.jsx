import JavascriptTimeAgo from "javascript-time-ago";
import en from 'javascript-time-ago/locale/en';
JavascriptTimeAgo.addLocale(en);
const minutesAgo = new JavascriptTimeAgo('en');
function filterConversationDetails(convo,participantsUsers) {
    const isGroup = convo.isGroup;
    const usernames = convo.participantsNames;
    let tileName = usernames[0];

    if (isGroup) {
      tileName = `${usernames[0]} and ${usernames.length} more`;
    }

    const lastChat = {};
    let chat_last = convo.chats[convo.chats.length - 1];
    
    if (chat_last) {
      // Check if the last chat content is text and has more than 4 characters
      let textContent = chat_last.text 
        ? (chat_last.text.length > 19
            ? chat_last.text.substring(0, 20) + '...' 
            : chat_last.text) 
        : null;
    
      lastChat.content = textContent ? <span>{textContent}</span> : <i>shared a file</i>;
      lastChat.sender = participantsUsers.find((user) => user.id === chat_last.senderId).username;
    } else {
      lastChat.content = <i>start chatting</i>;
      lastChat.new = true;
    }
    

    const timespan = !chat_last ? minutesAgo.format(Date.now()) : minutesAgo.format(new Date(chat_last.sendAt));
    const profileImage = convo.profileUrls;
    return {
      tileName,
      isGroup,
      lastChat,
      timespan,
      profileImage,
      usernames,
    };
  }

  export  {filterConversationDetails}