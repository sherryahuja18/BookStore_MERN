const passport = require('../middlewares/passport-config');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
require('dotenv').config();
const nodemailer = require('nodemailer');


const jwtSecret=process.env.JWT_SECRET_KEY;
const emailVerificationSecret=process.env.EMAIL_VERIFICATION_SECRET; 
const emailSender=process.env.EMAIL_SENDER; 
const hosturl=process.env.HOST_URL;
const port=process.env.PORT;

console.log('jwtSecret - ',jwtSecret );
console.log('emailVerificationSecret - ',emailVerificationSecret );
console.log('emailSender - ',emailSender );


exports.signup = async (req, res) => {
  console.log("inside signup method");
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Generate a verification token
    const verificationToken = jwt.sign({ email: req.body.email }, emailVerificationSecret);

    const newUser = await userModel.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      isActive: false,
      fullname:req.body.fullname,
      role: 'user',
      verificationToken: verificationToken,
    });

    const verificationLink = `${hosturl}${port}/auth/verify-email/${verificationToken}`;
    console.log('verificationLink - ', verificationLink);
    
    const mailOptions = {
      from: emailSender,
      to: req.body.email,
      subject: 'Email Verification',
      html: `Click <a href="${verificationLink}">here</a> to verify your email.`,
    };

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'sherryahuja18@gmail.com',
        pass: 'pbyejuxhgzbbvkgw',
      },
    });

    await transporter.sendMail(mailOptions);

    
    const token = jwt.sign(newUser.toJSON(), jwtSecret);
    return res.json({ user:newUser , token:token, message: 'Signup successful. Please check your email for verification' , token: verificationToken});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


exports.verifyEmail = async (req, res) => {
  const token = req.params.token;
  console.log('token value in backend - ',token);
  try {
    // Verify the token
    const decodedToken = jwt.verify(token, emailVerificationSecret);
    const userEmail = decodedToken.email;
    console.log('token email in backend - ',userEmail);

    // Update user's account to mark it as active
    await userModel.findOneAndUpdate({ email: userEmail }, { $set: { isActive: true } });

    return res.json({ message: 'Email verification successful. You can now login.' });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'Invalid or expired token. Please request a new verification email.' });
  }
};

exports.login = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user,info) => {
    if (err) {
      return res.status(401).json({ message: 'Authentication error' });
    }

    if (!user ) {
      return res.status(401).json({ message: info.message || 'Authentication failed' });
    }

    if(user.isActive==false){
      return res.status(401).json({ message: 'Account is deactivated. Kindly verify your account to activate' });
    }

    const token = jwt.sign(user.toJSON(), jwtSecret);
    return res.json({ user:user , token:token });
  })(req, res, next);
};

exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });



exports.googleAuthCallback = (req, res, next) => {
  // Log the route URL
  console.log('Callback route URL:', req.originalUrl);

  // Authenticate with Passport
  passport.authenticate('google', {
    failureRedirect: '/',
    session: false,
  })(req, res, () => {
    // This function will be called after authentication completes

    console.log('Reached the Google callback route');

  
    try {
      
      console.log('user value -',req.user);
      if (!req.user) {
        return res.status(401).json({ message: 'Google authentication failed' });
      }

      // Selectively include necessary user information in the response
      const userResponse = {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        isActive: req.user.isActive,
        fullname: req.user.fullname,
      };

      const token = jwt.sign(userResponse, jwtSecret);
      res.json({ token, user: userResponse });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
};
