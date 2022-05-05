
const mongoose = require('mongoose')
const { CONSTANTS } = require('../helpers/constant');
const { get: _get } = require('lodash');
const { dateTimeConversion } = require('../helpers/commonUtils');

const usersSchema = mongoose.Schema({
    
   email: { 
       type: String,
       validate: {
        validator: function(email) {
            var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return re.test(email)
        },
        message: props => `${props.value} is not a valid emali address!`
        },
    },
   password: { type: String },
   name: { type: String, trim: true },
   role: { type: String , enum: CONSTANTS.userRoles },
   isVerified: { type: Boolean, default: false },
   company: { type: String },
   country: { type: String },
   companyUrl: { type: String },
   designation: { type: String },
   phoneNumber: { type: String },
   refBy: { 
    type: String,
    validate: {
     validator: function(email) {
         var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
         return re.test(email)
     },
     message: props => `${props.value} is not a valid emali address!`
     },
    },
   token: { type: String },
   resetToken: { type: String },
   resetTokenGeneratedTime: { type: Date, default: Date.now },
   tokenGeneratedTime: { type: Date, default: Date.now },
   createdAt: { type: Date, default: Date.now },
   updatedAt: { type: Date, default: Date.now },
   createdBy: { type: mongoose.Schema.Types.ObjectId },
   modifiedBy: { type: mongoose.Schema.Types.ObjectId },
});

usersSchema.virtual('projects', {
    ref: 'Projects',
    localField: '_id',
    foreignField: 'createdBy'
})


const UsersStorage = mongoose.model('users', usersSchema, _get(CONSTANTS, 'collectionName.users'));



const userFindOne = getFields => UsersStorage.findOne(getFields);
const userFind = () => UsersStorage.find();
const saveUser = ({ data }) => UsersStorage.create(data);
const updateUser = ({ query, data }) => UsersStorage.update(query, data);




module.exports = {
    userFindOne,
    userFind,
    saveUser,
    updateUser,
};
