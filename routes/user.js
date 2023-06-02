import express from 'express';
import userModel from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { isAuthenticated } from '../middlewares/authentication.js';
const userRouter = express.Router();

//api to register a user
userRouter.post('/signup',async (req,res) => {
    const {email,password} = req.body;
    const error = {};

    if(!email)error.email = "Email is required!"
    else{
        let emailExists = await userModel.findOne({email : email}) ? true : false;
        if(emailExists){
            error.email = "Email already exists!"
        }
    }
    if(!password)error.password = "Password is required!"

    if(Object.keys(error).length){
        return res.status(400).json({
            statusCode : 400,
            error : error,
            message : 'User could not be added in the database!'
        })
    }

    let encryptedPassword = await bcrypt.hash(password,10);
    const user = new userModel({
        email,
        password : encryptedPassword
    });

    user.save()
      .then(() => {
        res.json({
            statusCode : 201,
            error : error,
            message : "User successfully created in the database!"
        })
      })

})

//api to login a user
userRouter.post('/login',async (req,res) => {
    let {email,password} = req.body;

    if(!email || !password){
        res.status(400).json({
            statusCode : 400,
            error : 'Invalid email or password!',
            message : 'email or password not provided!'
        })
    }

    let getuserData = await userModel.findOne({email},{email : 1,password : 1});

    if(!getuserData){
        res.status(400).json({
            statusCode : 400,
            error : 'User is not registered',
            message : 'User not registered!'
        })
    }
    
    let passwordCheck = await bcrypt.compare(password,getuserData.password) ? true : false;
    if(!passwordCheck){
        res.status(401).send({
            statusCode : 401,
            error : 'Password does not match!',
            message : 'Password is not correct!'
        })
    }

    const tokenPayload = {
        email,
        userId : getuserData?._id
    }

    const token = jwt.sign(tokenPayload,process.env.JWT_SECRET_KEY,{
        expiresIn : '8h'
    })

    res.json({
        stausCode : 200,
        error : '',
        message : 'User is logged in',
        jwtToken : token
    })
    
})

//api to get all the articles
userRouter.get('/articles',isAuthenticated,async (req,res) => {
    try{
        let allArticles = await userModel.find({ },{email : 1,article : 1});
        let articlesInfo = allArticles.map((allArticles) => {
            return {
                userInfo : {
                    _id : allArticles?._id,
                    email : allArticles?.email
                },
                article : allArticles?.article
            }
        })

        res.status(200).json({
            statusCode : 200,
            data : {
                data : articlesInfo
            },
            error : "",
            message : "All articles!"
        })
    }
    catch(error){
        res.status(400).json({
            statusCode : 400,
            message : error.message
        })
    }
})

//api to update user profile
userRouter.patch('/users/:userId',isAuthenticated, async (req,res) => {
    let {name,age} = req.body;
    let userId = req.params.userId || req.user.userId;
    if(!name || !age){
      res.status(400).json({
        statusCode : 400,
        error : 'name or age not provided in params'
      })
    }

    try{
       let updatedUser = await userModel.findOneAndUpdate({_id : userId},{name : name , age : age});
       res.status(201).json({
         statusCode : 201,
         message : 'User successfully updated!'  
       })
    }
    catch(error){
       res.status(400).json({
         error : error.message
       })
    }

})

//api to create an article
userRouter.post('/users/:userId/articles',isAuthenticated, async (req,res) => {
    let {title,description} = req.body;
    let userId = req.params.userId || req.user.userId;
    if(!title || !description){
       res.status(400).json({
         statusCode : 400,
         message : "provide the title and description!"
       })
    }
    try{
      let updatedArticle = await userModel.findOneAndUpdate({_id : userId},{
        $set : {'article.title' : title,'article.description' : description}
      })
      console.log(updatedArticle);
      res.status(201).json({
        statusCode : 201,
        message : 'Article Successfully updated!'
      })
    }
    catch(error){

    }
})

export default userRouter;

