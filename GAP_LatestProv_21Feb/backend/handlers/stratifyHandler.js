
const { cleanEntityData } = require('../helpers/commonUtils');

const { baseHandler } = require('../private/base-handler');

const {stratifyAdaptor} = require("../adaptors/stratify");




const stratifyHelper = async ({ body }) => {
    const res = await stratifyAdaptor({ body });
    return { content: res};
}


const stratifyHandler = async options => baseHandler(stratifyHelper, options);

module.exports = {
    stratifyHandler,
    
}
