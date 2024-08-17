const jwt=require("jsonwebtoken")
const catchAsync=require("../utils/catchAsync")
const appError=require("../utils/appErrors")
const {db}=require("../db/db_connection")
const {users,verification_factors}=require("../db/schema/schema.js")
const path=require("path")
const { eq, lt, gte, ne } =require('drizzle-orm');
const {validateProfile,compareThePassword,compareResetToken,createResetTokenPassword}=require('../utils/validateProfile')
const privateKey = process.env.SECRET_KEY
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
    req.session.userId=req.profile?.id
    req.session.token=req.token
    // send the response

    res.status(req.status||201).json({
      status:"ok",
      data:{
        profile:req.profile
      }
    })
    
})
// authenticating request ,this controller will help to authenticate the request
exports.authenticateRequest = catchAsync(async (req, res, next) => {
    // Step 1: Check for token in the Authorization header
    let token = null;
    const authHeader = req.headers['authorization'];
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Extract the token from the header
      token = authHeader.split(' ')[1];
    } else {
      // Check for token in cookies if not found in the header
      token = req.cookies?.authToken || null;
    }
    
    // Check for token in the session if not found in the header or cookies
    if (!token && req.session.token) {
      token = req.session.token;
    }
    if(req?.session?.passport?.user?.token)
      token=req.session.passport.user.token
    // If no token is found, return an error
    if (!token) {
      return next(new appError("No token was found", 403));
    }
    
    // Step 2: Decode and verify the token
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, privateKey); // Use jwt.verify to verify the token
      if (!decodedToken) {
        return next(new appError("Failed to decode token", 401));
      }
    } catch (err) {
      return next(new appError("Invalid token format", 401));
    }
    
    // Attach decoded token to the request object for further use
    req.user = decodedToken;
  
    // Proceed to the next middleware or route handler
    next();
  });

//   this token generator controller will help to gnerate a token for email verification and send a url to the designated email

exports.tokenGenerator=catchAsync(async function(req,res,next){
    const {email}=req.body  
    const userId=req.session.userId
    const profile=(email? await db.select().from(users).where(eq(users.email,email)):await db.select().from(users).where(eq(users.id,req.session.userId)))[0]
    if(!profile)
      return next(new appError("no profile with the email was prior registered ",400))
    console.log(profile)
    const {resetToken:tokenString}=await createResetTokenPassword({email})
    const payload={
      email:profile.email,
      token:tokenString
    }
    const token = jwt.sign(payload, privateKey, { expiresIn: '1h' });
    //disabling all the verification objects previously issued
    const verificationObjs=await db.select().from(verification_factors).where(eq(verification_factors.profileId,req.session.userId))
    await Promise.all(verificationObjs.map(async (obj)=>{
      //now saving the changes
      await db
      .update(verification_factors)
      .set({
        isValid:false,
        iseUsed:false
      })
      .returning({
        id: verification_factors.id
      });
    }))
    // creating a new verification row
    const verification_obj=(await db.insert(verification_factors).values({
        profileId:profile.id,
        value:token,
        
        }).returning({
            id:verification_factors.id,
        }))[0]
    //extracting the parent url route and making it ready to be send for the verification process
    const root = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    const parentRoute=(root.split('/').slice(0,root.split('/').length-1).join('/'))
    let redirectUri
    if(req.isSignup)
      redirectUri=`${parentRoute}/signup/${verification_obj.id}`
    else
      redirectUri=`${parentRoute}/verifyProfile/${verification_obj.id}`
  
    //now defining the sender,subject and its reciever for the verification
    req.body.to=email;
    req.body.from="prakharvision@gmail.com"
    req.body.subject=`to verify your email or reset password follow this link ${redirectUri}`
    req.body.url=redirectUri
    next()
  })
  //now this controller is to verify wether the token is correct and this will be caught when user will click
  //on the sended url in there mail 
  exports.authenticateVerification=catchAsync(async function(req,res,next){
    const {verifyId}=req.params;
    const verification_obj=(await db.select().from(verification_factors).where(eq(verifyId,verification_factors.id)))[0]
    console.log(verification_obj)
    if(!verification_obj)
      return next(new appError("verification time has either been expired or new verification token was issued",400))
    const profile=(await db.select().from(users).where(eq(users.id,verification_obj.profileId)))[0]
    if(!profile)
      return next(new appError("profile associated with this verification has been deleted from the database"))
    //check if the token has not been tampered it is somewhat not useful yet i did it anyways as the token was comming from the database
    if(! jwt.verify(verification_obj.value,privateKey))
      return next(new appError("invalid jwt token",403))
    const {email,token}=jwt.decode(verification_obj.value,privateKey)
    if(! await compareResetToken({email,providedToken:token}))
      return next(new appError("token is invalid",403))

    await db
    .update(users)
    .set({
      is_verified:true
    })
    .returning({
      id: users.id
    }).where(eq(profile.id,users.id));
    
    // ------------------------------------------------------------------------------------------
    // making the request ready for the following middleware this is in case of the verification of the email
    console.log(profile)
    req.profile=profile;
    const {username}=profile
    req.token=jwt.sign({ email, username }, privateKey);
    next()
  })