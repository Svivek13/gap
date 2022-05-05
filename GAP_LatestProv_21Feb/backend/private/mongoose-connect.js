const mongoose = require('mongoose');

// single mongo connection
const connectMongo = ({ mongoUrl, newUrlParser }) => mongoose.connect(mongoUrl, newUrlParser);


module.exports = {
    connectMongo
};
