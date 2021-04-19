const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema(
    {
        firstName: String,
        lastName: String,
        email: String,
     });
     
 mongoose.model('Admin', AdminSchema);
 module.exports = mongoose.model('Admin');
