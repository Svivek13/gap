const { cleanEntityData } = require('../helpers/commonUtils');

const { baseHandler } = require('../private/base-handler');

const {testTrainAdaptor} = require("../adaptors/testTrain");




const testTrainHelper = async ({ body }) => {
    const res = await testTrainAdaptor({ body });
    return { content: res};
}


const testTrainHandler = async options => baseHandler(testTrainHelper, options);

module.exports = {
    testTrainHandler
}
