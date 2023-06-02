//login
//signup 
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const isAuthenticated = (req,res,next) => {
 
  let token = req.headers.authorization.split(" ")[1];
  if(!token)return res.status(400).json({'message' : 'token is missing!'});
  
  let decodedtoken;
  try{
    console.log(token);
    decodedtoken = jwt.verify(token,process.env.JWT_SECRET_KEY);
  }
  catch(error){
    console.log(error.message);
    return res.status(400).json({
        message : error.message
    })
  }
  console.log(decodedtoken);

  req.user = decodedtoken;

//   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImltYWJoaXNoZWtyYWo4NzU3QGdtYWlsLmNvbSIsInVzZXJJZCI6IjY0Nzg2MmJiNzJhNjUxYmNlZjkwY2IyYyIsImlhdCI6MTY4NTY3MzYyNSwiZXhwIjoxNjg1Njc3MjI1fQ.Fcsn_2nUbSkBzClEnAEq0ift-qtVepdkfRB-NAFBvN0
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImltYWJoaXNoZWtyYWo4NzU3QGdtYWlsLmNvbSIsInVzZXJJZCI6IjY0Nzg2MmJiNzJhNjUxYmNlZjkwY2IyYyIsImlhdCI6MTY4NTY4MjI1NSwiZXhwIjoxNjg1NzExMDU1fQ.NVCozvhA8oVFEXG3_3dkQVIPrkplykPONuSnCW3W9a0

  next();
}