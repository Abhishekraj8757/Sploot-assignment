
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const isAuthenticated = (req,res,next) => {
 
  let token = req?.headers?.authorization?.split(" ")[1];
  if(!token)return res.status(400).json({'message' : 'token is missing!'});
  
  let decodedtoken;
  try{
    decodedtoken = jwt.verify(token,process.env.JWT_SECRET_KEY);
  }
  catch(error){
    console.log(error.message);
    return res.status(400).json({
        message : error.message
    })
  }

  req.user = decodedtoken;
  next();
}