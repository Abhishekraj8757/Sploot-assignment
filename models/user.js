import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    //email,password,name,age
    id : {type : String},
    email : {type : String,required : true},
    password : {type : String,required : true},
    name : {type : String},
    age : {type : Number},
    article : {
        title : {type : String},
        description : {type : String}
    }
})

export default mongoose.model("Users",userSchema);