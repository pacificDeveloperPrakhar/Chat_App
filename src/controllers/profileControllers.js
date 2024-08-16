const catchAsync=require("../utils/catchAsync")
const validateProfile=require('../utils/validateProfile')
const appError=require("../utils/appErrors")
const {db}=require("../db/db_connection")
const {users}=require("../db/schema/schema.js")
const { eq, lt, gte, ne } =require('drizzle-orm');

exports.signup=catchAsync(async(req,res,next)=>{
    const {email,username,password}=req.body
    //checking the credentials
    const {isValid,message}=validateProfile(req.body)
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
    res.status(200).json(data)
    })
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
