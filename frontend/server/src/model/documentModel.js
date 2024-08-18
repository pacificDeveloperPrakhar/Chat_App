const mongoose=require('mongoose')
const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    default: "",
    requried: true,
  },
  dateOfModification: {
    type: Date,
    default: (() =>  Date.now())(),
  },
  dateOfCreation: {
    type: Date,
    default: (() => Date.now())(),
  },
},
{
  
  toJSON:{
    virtuals:true
    },toObject:{
      virtuals:true
    }
  }
  );
const documentModel=mongoose.model("documents",documentSchema)
module.exports=documentModel