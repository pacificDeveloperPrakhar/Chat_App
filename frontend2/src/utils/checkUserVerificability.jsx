

export default function checkUserVerificability(user) {
    const info={}
  if(!user.is_verified)
  {
      info.type="info"
      info.mssg=`email not verified : check your email ${user.email}`
  }
  if(user.is_verified)
  {
      info.type="success"
      info.mssg=`email verified : login successfully as ${user.email}`
  }
  return (
    info
  )
}
