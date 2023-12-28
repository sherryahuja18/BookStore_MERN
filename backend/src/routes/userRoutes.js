//similar to controller java classes ( FYI)
const express = require('express');
const {toggleActive,getUser,toggleRole,getAllUsers } = require('../controllers/userController');
const userRouter = express.Router();


userRouter.get("/admin",getAllUsers)                                 //admin dashboard
userRouter.get("/:userId",getUser)

userRouter.put("/admin/:userId/toggle-active/",toggleActive)    //admin
userRouter.put("/admin/:userId/toggle-role/",toggleRole)        //admin
//if we want to user userRouter objects in other files, we have to export it
module.exports = userRouter;