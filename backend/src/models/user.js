//similar to enities java classes ( FYI)

const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const UserSchema = mongoose.Schema({
  
    fullname: { type: String, required: false },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    role: { type: String, default: 'user' },
    verificationToken: { type: String },
    
}, {timestamps:true})

UserSchema.pre('save', async function (next) {
    try {
      // Only hash the password if it's modified or new
      if (!this.isModified('password')) {
        return next();
      }
  
      // Generate a salt
      const salt = await bcrypt.genSalt(10);
  
      // Hash the password along with the new salt
      const hash = await bcrypt.hash(this.password, salt);
  
      // Override the cleartext password with the hashed one
      this.password = hash;
  
      return next();
    } catch (error) {
      return next(error);
    }
  });
  
  UserSchema.methods.verifyPassword = async function (password) {
    try {
      // Use bcrypt to compare the provided password with the hashed password
      return await bcrypt.compare(password, this.password);
    } catch (error) {
      throw error;
    }
  };

//whenevr we want to save user object in db, we will use User object
module.exports= mongoose.model("User",UserSchema);