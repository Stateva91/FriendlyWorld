const mongoose= require('mongoose');
const bcrypt = require('bcrypt');
const userSchema=new mongoose.Schema({
   username: {
    type: String,
    require: [true, 'Username is required'],
    unique: true,
   },
   password: {
    type: String,
    require: [true, 'Password is required'],
   },
   email: {
    type: String,
    require: [true, 'Email is required'],
   }
});

userSchema.virtual('repeatPassword')
.set(function(value){
    if(this.password !==value){
        throw new Error('Password missmatch!');
    }
});

userSchema.pre('save', async function(){
    const hash=await bcrypt.hash(this.password, 10);
    this.password=hash;
});

const User=mongoose.model('User', userSchema);
module.exports = User;
