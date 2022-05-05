
const { cleanEntityData } = require('../helpers/commonUtils');

const { baseHandler } = require('../private/base-handler');
const { faqFind } = require("../models/faq");




const fetchFAQHelper = async () => {
    const res = await faqFind({});
    return { content: res};
}


const fetchFAQHandler = async options => baseHandler(fetchFAQHelper, options);

module.exports = {
    fetchFAQHandler,
    
}
