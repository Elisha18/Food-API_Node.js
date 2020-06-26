const mongoose = require('mongoose');
const Joi = require('Joi');

const config = require('config');
const jwt = require('jsonwebtoken');

const userModel = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim:true,
      },
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true,
        minlength:6,
        maxlength:255,
    },
    role: {
        type: String,
        required: true,
        default: "user"
    },
    date: {
        type: Date,
        default: Date.now
    },
    isAdmin: Boolean
});

// creating JSON token
userModel.methods.generateAuthToken = function(){
    const token = jwt.sign({
        _id:this._id,
        name:this.name,
        role:this.role}, config.get('jwtPrivateKey'));
    return token;
}


const User = mongoose.model("User",userModel);

function validateUser(user){
    const schema = {
        name:Joi.string().min(4).required(),
        email:Joi.string().required().email(),
        password:Joi.string().required().min(8).max(255),
        role:Joi.string().required()
    }

    return Joi.validate(user,schema);

}

// Helper function to save data into the database

// async function createUser(){
//     // 3. creating the object for class Course
//     const user = new User({
//         name: 'React.js course',
//         email:'imelishageorge@gmail.com',
//         password:'123456789',
//         role:'user',
//         isAdmin:false
//     });
    
//     // 4. Save in a database
//     const result = await user.save();   // returns the promise object
//     console.log(result);
// }

// createUser();

exports.User = User;
exports.userModel = userModel;
exports.validate = validateUser;