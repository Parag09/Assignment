const mongoose=require('mongoose');
const Schema = mongoose.Schema;


const citySchema= mongoose.Schema({
    uuid: {type :String , required :true},
    name : {type : String , required :true }
});

const city =mongoose.model('city',citySchema);

module.exports={
    City:city
}









