const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);


mongoose.connect('mongodb+srv://dbUser:d5cumsDXFmTqdpF@cluster0.paz2z.mongodb.net/Nuber?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
