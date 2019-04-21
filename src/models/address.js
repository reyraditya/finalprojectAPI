const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if(!isNaN(parseInt(value))){
                throw new Error ("First name cannot be number")
            }
        }
    },
    last_name: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if(!isNaN(parseInt(value))){
                throw new Error ("Last name cannot be number")
            }
        }
    },
    street: {
        type: String,
        required: true,
        trim: true
    },
    city:{
        type: String,
        required: true,
        trim: true
    },
    province: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
        trim: true
    },
    postal_code: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if(isNaN(value)){
                throw new Error ("Phone number cannot be alphabetical")
            }
        }
    },
    owner : { 
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

const Address = mongoose.model('Address', addressSchema) 

module.exports = Address