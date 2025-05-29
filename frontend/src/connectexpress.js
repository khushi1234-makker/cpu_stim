import mongoose from "mongoose";
import express from "express";

import { assigntype } from "../model/assigntype";
// const assigntype = require('../model/assigntype');

 let conn=await mongoose.connect("mongodb://localhost:27017/assigntypes")
const app=express();
const port=3000;
app.get('/',(req,res)=>{
    const assigntype= new assigntype({title:1, desc:"null string",isdone:"hogya",days:3})
    assigntype.save()
    res.send("data saved")
})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    });