import JavascriptTimeAgo from "javascript-time-ago";
import en from 'javascript-time-ago/locale/en';
JavascriptTimeAgo.addLocale(en);
const minutesAgo = new JavascriptTimeAgo('en');
export function formatTimeAgo(time){
    return minutesAgo.format(new Date(time))
}
function formatTime(time){

    let hours = new Date(time).getHours();
    let minutes = new Date(time).getMinutes();
    let meridiem = hours >= 12 ? 'PM' : 'AM';
    
    // Adjusting hours to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12;
    
    const currentTime = `${hours}:${minutes} ${meridiem}`;
    return currentTime
}
export default formatTime
