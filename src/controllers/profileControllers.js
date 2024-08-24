const catchAsync=require("../utils/catchAsync")
const {validateProfile,compareThePassword,compareResetToken}=require('../utils/validateProfile')
const appError=require("../utils/appErrors")
const {db}=require("../db/db_connection")
const {users}=require("../db/schema/schema.js")
// will use jwt to create token while login and signup and store the in the session
const jwt = require("jsonwebtoken");
const { eq, lt, gte, ne } =require('drizzle-orm');
const privateKey = process.env.SECRET_KEY
const bcrypt=require("bcrypt")
// signing up controller this controller will first pass the data in a object format to the validateProfile functions
// then this function will return if the data is valid and the message which will be helpful in validating the data being inputted
exports.signup=catchAsync(async(req,res,next)=>{
    let {email,username,password}=req.body
    console.log(req.body)
    password=await bcrypt.hash(password,10);
    //checking the credentials
    const {isValid,message}=validateProfile(req.body)
    const profile=(await db.select().from(users).where(eq(users.email, email)))[0];
    
    if(profile&&!profile?.is_verified)
        {   req.session.userId=profile.id
            req.isSignup=true
            return next()
        }
    if(!isValid)
        return next(new appError(message,400))
    
    const data=await db.insert(users).values({
        email,
        username,
        password
    }).returning({
        id:users.id,
        sockets:users.socketConnected
    })
    req.session.userId=data.id
    req.isSignup=true
    next()
     
    })
// this controller will retrieve all the user data rows stored in the data base 
// also this is to make sure that user is displayed with only relevant data
// and not irrelevant one such as password and passwordReset token
exports.getAllProfiles=catchAsync(async function(req,res,next){
    const results = await db.select({
        id: users.id,
        email: users.email,
        username: users.username,
        is_verified: users.is_verified,
        updated_at: users.updatedAt,
        created_at: users.createdAt,
        socketConnected: users.socketConnected,
        profileImg:users.profileUrl

    }).from(users);
    
    const length=results.length
    res.status(200).json({
        status:"ok",
        length,
        data:{
            users:results
        }
    })
})
// this controller will retrieve the data by the id passed in the params field
exports.getProfileById=catchAsync(async function (req,res,next) {
    const {userId}=req.params
    const profile=await db.select().from(users).where(eq(users.id, userId));
    if(!profile)
        return next(new appError("no profile was found",400))
    res.status(200).json({
        status:"ok",
        data:{
            profile
        }
    })

})
// this controller is to login
exports.login = catchAsync(async function (req, res, next) {
    const { email, password } = req.body;
  
    // Check if the email and password are provided
    if (!email) return next(new appError("Email parameter is missing", 400));
    if (!password) return next(new appError("Password parameter is missing", 400));
    
    // Find the user profile by email
    const profile= (await db.select().from(users).where(eq(users.email,email)))[0]
    
    // Check if the profile exists and the password is correct
    if (!profile) {
      return next(new appError('email not found', 401));
    }
    if(!await compareThePassword({email,password}))
        return next(new appError('invalid password', 401));
        // Generate JWT token
    const token = jwt.sign({ email }, privateKey);
    
    // Set the token as a cookie
     req.token=token;
     req.profile=profile;
     req.status=200
     next()
  });
  
  exports.attachProfile=catchAsync(async function (req,res,next) {
    const profile=(await db.select().from(users).where(eq(users.email, req.body.email)))[0];
    req.profile=profile
    next()
  })