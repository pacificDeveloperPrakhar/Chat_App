const jwt=require("jsonwebtoken")
const catchAsync=require("../utils/catchAsync")
// issuing token and storing that inside the session storage
exports.issueToken=catchAsync(async function(req,res,next){
    // Set the token as a cookie
    res.cookie('jwt', req.token, {
      httpOnly: false, // Cookie is not accessible via JavaScript
      secure: false, // Set to true in production (HTTPS only)
      sameSite: 'strict', // CSRF protection
      maxAge: 30 * 24 * 60 * 60 * 1000, // Cookie expiration (30 days)
    });
    
    // Set the token in the Authorization header
    res.setHeader('Authorization', `Bearer ${req.token}`);
    // token has been stored to the session storage
    req.session.token=req.token
    // send the response

    res.status(req.status||201).json({
      status:"ok",
      data:{
        profile:req.profile
      }
    })
    
})