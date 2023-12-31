const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const soleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required:true
    },
    phone:{
        type: Number,
        required:true
    },
    profession:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    country:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required:true
    },
    imageUrl: {
        type: String,
        required: true,
      },
    tokens:[
        {
            token: {
                type: String,
                required:true
            }
        }
    ]
})



// Hashing The Password

soleSchema.pre('save',async function (next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();

});


//Generating Token
soleSchema.methods.generateAuthToken = async function () {
    try{
        let token = jwt.sign({_id:this._id}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token});
        await this.save();
        return token;
    } catch (err) {   
        console.log(err);
    }
}


// Collection Creation
const soleDistributor = mongoose.model('Sole Distributors',soleSchema);
module.exports = soleDistributor;