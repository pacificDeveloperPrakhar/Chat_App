import React, { useEffect ,useRef} from 'react'
import Avatar from "./AvatarOnline&Offline";
import { MdOutlineArrowUpward } from "react-icons/md";
import { useSelector } from 'react-redux';
import { IoCloudDoneOutline } from "react-icons/io5";
import axios from '../utils/axiosConfigured';
import { useDispatch } from 'react-redux';
import { updatedUserProfilePicture } from '../slices/userSlice';
export default function Me () {
  const user=useSelector(state=>state.user.user)
  const users=useSelector(state=>state.user.users)
  const dispatch=useDispatch()
  const data=useRef({})
  function handlefileUpload(e){
    const value=e.target?.files?.[0]||e.target.value
    data.current={...data.current,[e.target.name]:value}
    dispatch(updatedUserProfilePicture(data.current))
  }
  useEffect(()=>{
    document.cookie="hi this is me"
    if(!user?.profileUrl)
      return
    console.log(user.profileUrl)

  },[user])
  return (
    <div className="bg-white flex-1 flex h-full justify-center items-center">
      <div className="me flex-col relative">
       <div className="profile_picture_view  rounded-full relative">
          <Avatar size={190} src={user?.profileUrl} username={user?.username}/>
          <span className='upload absolute  p-3 ' style={{
            fontSize:"3rem"
          }}>
            <label htmlFor="images">
              
            {!user?.profileUrl?<MdOutlineArrowUpward />:<IoCloudDoneOutline />}
          <input type="file" name="images" id="images" className='hidden' onChange={handlefileUpload}/>
            </label>
          </span>
       </div>
       <button onClick={async ()=>{
        await axios.get('/profiles/authenticate')
        .then(response => {
          console.log('Response data:', response.data);
        })
        .catch(error => {
          console.error('Error:', error);
        });
      
       }}>verify the authentication</button>
      </div>

    </div>
  )
}
