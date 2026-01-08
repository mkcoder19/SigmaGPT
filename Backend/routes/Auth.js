import express from "express";
import {Users} from "../models/Users.js";
import httpStatus from "http-status-codes";
import bcrypt from "bcrypt";
import crypto from "crypto";
const router = express.Router();

router.post('/register' , async (req , res)=>{
    const {name , username , password} = req.body;

    try{
        const existingUser = await Users.findOne({username});

        if(existingUser){
            return res.status(httpStatus.CONFLICT).json({message : "User already exists"})
        }

        const hashedPassword = await bcrypt.hash(password , 10);
        const token = crypto.randomBytes(20).toString("hex");

        const newUser = new Users({
            name : name,
            username : username,
            password : hashedPassword,
            token,
        })

        await newUser.save();

        res.status(httpStatus.CREATED).json({
            message : "User registered successfully",
            token,
            user : {
                id : newUser._id,
                name : newUser.name,
                username : newUser.username
            }
        });
    }catch(e){
        res.status(500).json({message : `Some error occured : ${e}`});
        console.log(e);
    }
})

router.post('/login', async (req , res)=>{
    const {username , password} = req.body;

    if(!username || !password){
        return res.status(400).json({message : "Please fill the given details"});
    }

    try{
        const user = await Users.findOne({username});

        if(!user){
            return res.status(httpStatus.NOT_FOUND).json({message : "You need to register first"});
        }

        const isPasswordCorrect = await bcrypt.compare(password , user.password);

        if(isPasswordCorrect){
            const token = crypto.randomBytes(20).toString("hex");

            user.token = token;
            await user.save();
            return res.status(httpStatus.OK).json({token : token});
        }else{
            return res.status(httpStatus.UNAUTHORIZED).json({message : "Invalid username or password"});
        }
    }catch(e){
        console.log(e);
        res.status(500).json({message : `Some error occured : ${e}`})
    }
})

export default router;