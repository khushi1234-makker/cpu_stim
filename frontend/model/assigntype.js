import mongoose from "mongoose";
const assigntypes=new mongoose.Schema({
    title: String,
    desc: String,
    isdone:Boolean,
    days:number,
});
export const assigntype= mongoose.model('assigntype',assigntypes);