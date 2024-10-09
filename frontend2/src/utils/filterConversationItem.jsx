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
      lastChat.content = chat_last.text ? <span>{chat_last.text}</span> : <i>shared a file</i>;
      lastChat.sender = participantsUsers.find((user) => user.id === chat_last.senderId).username;
    } else {
      lastChat.content = <i>start chatting</i>;
      lastChat.new = true;
    }

    const timespan = !chat_last ? minutesAgo.format(Date.now()) : minutesAgo.format(new Date(chat_last.sendAt));
    const profileImage = convo.profileUrls;
    const isTyping=participantsUsers.filter(u=>convo.isTyping.includes(u.id)).map(u=>u.username)||[]
    const inChat=participantsUsers.filter(u=>convo.inChat.includes(u.id)).map(u=>u.username)||[]
    return {
      tileName,
      isGroup,
      lastChat,
      timespan,
      profileImage,
      usernames,
      isTyping,
      inChat
    };
  }

  export  {filterConversationDetails}