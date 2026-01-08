import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name : {
            type : String,
            required : true
        },
        username : {
            type : String,
            required : true
        },
        password : {
            type : String,
            required : true
        },
        token : {
            type : String,
        }   
    }
)

const Users = mongoose.model("Users" , UserSchema);
export {Users};