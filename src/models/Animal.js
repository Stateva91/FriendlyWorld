const mongoose=require('mongoose');

const photoSchema=new mongoose.Schema({
    name: {
        type: String,
        required: [true,'Name is required'],
        minLength: [2, 'Name should be at least 2 characters'],
    },
    years: {
        type: Number,
        required: [true,'Age is required'],
        min:1,
        max:100,
    },
    kind: {
        type: String,
        required: [true,'ImageUrl is required'],
        
    },
    image: {
        type: String,
        required: [true,'ImageUrl is required'],
        match:[ /^https?:\/\//, 'Invalid url' ]
    },
    need: {
        type: String,
        required: [true,'ImageUrl is required'],
        
    },
    location: {
        type: String,
        required: [true,'Location is required'],
        minLength:5,
        maxLength:50,
    },
    description: {
        type: String,
        required: [true,'Description is required'],
        minLength:5,
        maxLength:50,
    },
   
    owner:{
        type:mongoose.Types.ObjectId,
        ref: 'User',
    },
    donations:[
        {
            user:{
                type: mongoose.Types.ObjectId,
                required:true,
                ref:'User',
            },
            message:{
                type: String,
                required: [true,'Donated an animal is required']
            } 
        }
    ]
});

const Photo=mongoose.model('Photo', photoSchema);

module.exports=Photo;