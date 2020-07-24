const mongoose = require('mongoose')

// db connection
mongoose.connect('mongodb://127.0.0.1:27017/loginregister');
let db= mongoose.connection;
db.on('error',console.error.bind(console,'connection error'));
db.once('open',function callback() {
    console.log('connection estabilished');
});
exports.db=db;