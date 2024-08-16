const validator=require("validator")
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
  module.exports=validateProfile