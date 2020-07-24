const mongoose=require('mongoose');
const Schema = mongoose.Schema;



const userSchema= mongoose.Schema({
    email: {
        type: String,
        required:true, 
        unique:true,
        match:/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
    },
    password: {
        type: String,
        required:true 
    },
    city : {
        type: Schema.Types.ObjectId,
        ref: 'City',
        required: true

    },
    location : {},

    address : {
        type : String,
        required : true
    },
    connections : [],
    dist : {},
});
userSchema.index({point:"2dsphere"});
const users=mongoose.model('users',userSchema);

module.exports={
        Users:users
}