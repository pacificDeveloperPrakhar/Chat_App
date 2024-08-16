const catchAsync = require('../utils/catchAsync.js');
const AppError=require("../utils/appErrors.js")
const nodemailer=require("nodemailer")

  // Your sendMail function
  exports.sendMail = catchAsync(async (req, res, next) => {
    // Check for required fields and throw an error if they are missing
    console.log(req.body);
    if (!req.body.to || !req.body.from || !req.body.subject || !req.body.url) {
      return next(new AppError('Missing required fields: to, from, subject, or URL', 400));
    }
  
    // Read the email template from a file
    const filePath = path.join(__dirname,"../","../", 'public','emailView.html'); // Adjust the file path as needed
    let emailContent = fs.readFileSync(filePath, 'utf-8');
  
    // Replace the placeholder %URL% with the actual URL from req.body.url
    emailContent = emailContent.replace(/%URL%/g, req.body.url);
  
    // Create a transporter object using the Mailtrap service
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "0347f91a78020d",
        pass: process.env.mailtrap_pass // Replace with your Mailtrap password
      }
    });
  
    // Define the email options with the modified HTML content
    const mailOptions = {
      from: req.body.from, // Sender address
      to: req.body.to, // List of recipients
      subject: req.body.subject, // Subject line
      html: emailContent // HTML body from the file
    };
  
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return next(new AppError(`Error occurred while sending email: ${error.message}`, 500));
      }
      console.log('Email sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  
      res.status(200).json({
        message: !req.isSignup?`Reset token has been sent to ${req.body.to}`:`to verify your email check the mail send to ${req.body.to}`
      });
    });
  });
  