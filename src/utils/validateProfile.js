const validator=require("validator")
//i am importing  the connection to retrieve the user by the email row and make changes to it
const {db}=require("../db/db_connection")
// i am importing the user schema to modify the data and save it 
const {users}=require("../db/schema/schema");
const bcrypt=require("bcrypt")
const crypto=require("crypto")
const { eq } = require("drizzle-orm");
const { password } = require("pg/lib/defaults");
const validateProfile = ({ email, password, confirmPassword }) => {
    // Check if the email is valid using the validator library
    if (!validator.isEmail(email)) {
      return { isValid: false, message: 'Invalid email address' };
    }
  
    // Check if the password and confirmPassword match
    if (password !== confirmPassword) {
      return { isValid: false, message: 'Passwords do not match' };
    }
  
    // If both checks pass, return a valid result
    return { isValid: true };
  };
  // this password reset createing function is heplful when i intend to verify the password and also when i need to reset the password
  const createResetTokenPassword=async function({email}){
   const profile= await db.select().from(products).where(eq(user.email,email))
   const resetToken = crypto.randomBytes(32).toString('hex');
  
  profile.passwordResetToken= await bcrypt.hash(resetToken,10);
  
  // console.log({ resetToken }, this.passwordResetToken);
  console.log("token being send after hashing",resetToken)
  // add when this password reset will expire
  profile.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
  //now save the changes
  const {id}=await db
  .update(users)
  .set(profile)
  .returning({
    id: products.id
  });
  return {resetToken,id};
  }
  // function to compare the password when the user enters the credentials to login which will take the email and password
  // it will retrieve the data by the inputted email and compare the hash passord and inputted password
  const compareThePassword=async function({email,password}){
    const profile= (await db.select({password:users.password}).from(users).where(eq(users.email,email)))[0]
    console.log(profile)
    return await bcrypt.compare(password, profile.password);
  }
  //
  // now i will create a function to compare the resetToken
  // i know its a bad code practice and i should rather had used the same comapare function
  // but it was much easier to create a new funciton than modifying the previous one
  //
  const compareResetToken = async function(providedToken) {
    const profile= (await db.select({
      passwordResetToken:users.passwordResetToken
    }).from(users).where(eq(users.email,email)))[0]
    return await bcrypt.compare(providedToken,profile.passwordResetToken)
  };
  module.exports={validateProfile,createResetTokenPassword,compareResetToken,compareThePassword}