const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    username: {
        type: String, // type of data, when we type the  number, it will be converted into strings
        required: true, // client has to provide the name
        unique: true, 
        trim: true, // remove all spaces before and after string
        validate(value) {
            if(!isNaN(parseInt(value))) { // if the incoming value is numbers
                throw new Error("Name cannot be numbers, seriously ?")
            }
        }
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!isEmail(value)){
                throw new Error("Email is invalid")
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error("Password cannot contain word 'password")
            }
        }
    }

})

// Secure user credentials while login
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});
    if(!user){
        throw new Error("Unable to Login")
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        throw new Error ("Unable to Login")
    }

    return user
}

// Hash password before login
userSchema.pre('save', async function(next) {
    const user = this // access to user's {name, email, password}

    if(user.isModified('password')){ // is the password modified?
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()

})


const User = mongoose.model('User', userSchema)

module.exports = User