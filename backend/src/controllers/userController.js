const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const SECRET_KEY= process.env.JWT_SECRET_KEY;
console.log('jwt - ', SECRET_KEY);


const signup =async(req,res) => {
   
   const {username, email, password,isActive,role} = req.body;
   console.log("username"+username);
    
   //existing user check
   try {
    //execution will wait till it gives response
    const existingUser  = await userModel.findOne({email:email});
    if (existingUser) {
        return res.status(400).json({message :"User already exisists"});
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password,10);


    //create new user
    const result = await userModel.create({
        email:email,
        password:hashedPassword,
        username:username,
        isActive:isActive,
        role: role
    });


     //generate token
     //payload (first arg) : inf about user to validate later
     //secret key
     const token = jwt.sign({
        email:result.email,
        id: result._id
     }, SECRET_KEY);

     res.status(201).json({user:result,token: token});

   } catch (error) {
    console.log(error);
    res.status(500).json({message :"Something went wrong"});
   }


  
}

const signin =async(req,res) => {
    const {email, password} = req.body;

    try {
          //check exisiting user
        const existingUser  = await userModel.findOne({email:email});
        if (!existingUser) {
            return res.status(404).json({message :"User not found"});
        }

        //deactivated user logic
        console.log(existingUser.isActive);
        if (existingUser && !existingUser.isActive) {
            return res.status(403).send('Account is deactivated. Please contact the administrator.');
        }
    
        //validate user credentials and signin
        //req has normal passowrd, db has hashed password. So decrypt the password 
        const matchPassword = await bcrypt.compare(password,existingUser.password);
        
        //not working
        if (!matchPassword) {
            return res.status(400).json({message :"Invalid credentials"});
        }

         //signin, after generating token
         const token = jwt.sign({
            email:existingUser.email,
            id: existingUser._id
         }, SECRET_KEY);
         
         res.status(201).json({user:existingUser,token: token});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message :"Something went wrong"});
    }
}


const toggleActive =async(req,res) => {
    try {
        const user = await userModel.findById(req.params.userId);
    
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        user.isActive = !user.isActive;
        await user.save();
    
        res.json({ message: 'User isActive toggled successfully' });
      } catch (error) {
        console.error('Error toggling isActive:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
}

const toggleRole = async (req, res) => {
    try {
      const user = await userModel.findById(req.params.userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user.role = user.role === 'user' ? 'admin' : 'user';
      await user.save();
  
      res.json({ message: 'User role toggled successfully' });
    } catch (error) {
      console.error('Error toggling role:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

const getUser =async(req,res) => {
    try {
         
        const existingUser  = await userModel.findOne({email:req.params.userId});
        if (!existingUser) {
            return res.status(404).json({message :"User not found"});
        }
        res.status(201).json(existingUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({message :"Something went wrong"});
    }
}

const getAllUsers =async(req,res) => {
    try {
         
        const existingUser  = await userModel.find();
        if (!existingUser) {
            return res.status(404).json({message :"User not found"});
        }
        res.status(201).json(existingUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({message :"Something went wrong"});
    }
}




module.exports = {signup, signin,toggleActive,getUser,toggleRole,getAllUsers};