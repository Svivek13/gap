
const mongoose = require('mongoose')
const { CONSTANTS } = require('../helpers/constant');
const { get: _get } = require('lodash');


const invitationSchema = mongoose.Schema({
   sender: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
   receiver: [{
                type: String,
                validate: {
                    validator: function(email) {
                        
                        var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                        return re.test(email)
                    },
                    message: props => `${props.value} is not a valid emali address!`
                    },
            }],
   
   createdAt: { type: Date, default: Date.now },
   updatedAt: { type: Date, default: Date.now },
   createdBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
   modifiedBy: { type: mongoose.Schema.Types.ObjectId },
   
});

const InvitationStorage = mongoose.model('invitations', invitationSchema, _get(CONSTANTS, 'collectionName.invitations'));


const postInvitation = ({ data }) => InvitationStorage.create(data);



module.exports = {
    postInvitation,
};
