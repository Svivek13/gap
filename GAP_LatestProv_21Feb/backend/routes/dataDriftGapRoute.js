const dataDriftGapHandler_ = require('../handlers/dataDrift_GapHandler');
const driftTestTrainHandlerCardProb = require('../handlers/dataDriftTrainCardProbHandler');
const driftTestHandlerCardProb = require('../handlers/dataDriftTestCardProbHandler');
const dmTestCardRevHandlerdata = require('../handlers/dmTestCardRevHandler');
const dmTrainCardRevHandlerdata = require('../handlers/dmTrainCardRev');
const dmTestnonCardRevHandlerdata = require('../handlers/dmTestnonCardRevHandler');
const dmTrainnonCardRevHandlerdata = require('../handlers/dmTrainnonCardRevHandler');
const dmTestnonCardProbHandlerdata = require('../handlers/dmTestnonCardProbHandler');
const dmTrainnonCardProbHandlerdata = require('../handlers/dmTrainnonCardProbHandler');
const testDensityHandlerdata = require('../handlers/testDensityHandler');
const trainDensityHandlerdata = require('../handlers/trainDensityHandler');
const segmentDensityHandler = require('../handlers/segmentDensityHandler');
const segmentDensityTestHandler = require('../handlers/segmentDensityTestHandler')
const baseCtrl = require('../private/base-controller');
const { get: _get } = require("lodash");

module.exports = function(app) {
    app.post('/api/data-drift-record', async(req, res, next) => {
        const body = req.body;
         
        baseCtrl.postAsync(req, res, next, async(_) => {
            const responseData = await dataDriftGapHandler_.dataDriftGapHandler({ body });
            return responseData;
        })
    });
    app.post('/api/dm-drift-brand-dropdown', async(req, res, next) => {
        const body = req.body;
         
        baseCtrl.postAsync(req, res, next, async(_) => {
            const responseData = await dataDriftGapHandler_.dataDMDrift_GapDropdownBrandHandler({ body });
            return responseData;
        })
    });
    app.post('/api/dm-drift-location-dropdown', async(req, res, next) => {
        const body = req.body;
         
        baseCtrl.postAsync(req, res, next, async(_) => {
            const responseData = await dataDriftGapHandler_.dataDMDrift_GapDropdownLocationHandler({ body });
            return responseData;
        })
    });
    app.post('/api/data-drift-data', async(req, res, next) => {
        const body = req.body;
         
        baseCtrl.postAsync(req, res, next, async(_) => {
            const responseData = await dataDriftGapHandler_.dataDrift_GapHandler({ body });
            return responseData;
        })
    });
    app.post('/api/drift-brand-dropdown', async(req, res, next) => {
        const body = req.body;
         
        baseCtrl.postAsync(req, res, next, async(_) => {
            const responseData = await dataDriftGapHandler_.dataDrift_GapDropdownBrandHandler({ body });
            return responseData;
        })
    });
    app.post('/api/drift-location-dropdown', async(req, res, next) => {
        const body = req.body;
         
        baseCtrl.postAsync(req, res, next, async(_) => {
            const responseData = await dataDriftGapHandler_.dataDrift_GapDropdownLocationHandler({ body });
            return responseData;
        })
    });

    app.post('/api/train-density', async(req, res, next) => {
        const body = req.body;
        baseCtrl.postAsync(req, res, next, async(_) => {
            const responseData = await trainDensityHandlerdata.trainDensityHandler({ body });
            return responseData;
        })
    });
    app.post('/api/test-density', async(req, res, next) => {
        const body = req.body;
        baseCtrl.postAsync(req, res, next, async(_) => {
            const responseData = await testDensityHandlerdata.testDensityHandler({ body });
            return responseData;
        })
    });
    app.post('/api/drift-train-test', async(req, res, next) => {
        const body = req.body;
        baseCtrl.postAsync(req, res, next, async(_) => {
            const responseData = await driftTestTrainHandlerCardProb.dataDriftTrainHandler({ body });
            return responseData;
        })
    });
    app.post('/api/drift-test-prob', async(req, res, next) => {
        const body = req.body;
        baseCtrl.postAsync(req, res, next, async(_) => {
            const responseData = await driftTestHandlerCardProb.dataDriftTestHandler({ body });
            return responseData;
        })
    });
    
    app.post('/api/dm-test-cardRev', async(req, res, next) => {
        const body = req.body;
        baseCtrl.postAsync(req, res, next, async(_) => {
            const responseData = await dmTestCardRevHandlerdata.dmTestCardRevHandler({ body });
            return responseData;
        })
    });
    app.post('/api/dm-train-cardRev', async(req, res, next) => {
        const body = req.body;
        baseCtrl.postAsync(req, res, next, async(_) => {
            const responseData = await dmTrainCardRevHandlerdata.dmTrainCardRevHandler({ body });
            return responseData;
        })
    });
    app.post('/api/dm-test-noncardRev', async(req, res, next) => {
        const body = req.body;
        baseCtrl.postAsync(req, res, next, async(_) => {
            const responseData = await dmTestnonCardRevHandlerdata.dmTestnonCardRevHandler({ body });
            return responseData;
        })
    });
    app.post('/api/dm-train-noncardRev', async(req, res, next) => {
        const body = req.body;
        baseCtrl.postAsync(req, res, next, async(_) => {
            const responseData = await dmTrainnonCardRevHandlerdata.dmTrainnonCardRevHandler({ body });
            return responseData;
        })
    });
    app.post('/api/dm-test-noncardProb', async(req, res, next) => {
        const body = req.body;
        baseCtrl.postAsync(req, res, next, async(_) => {
            const responseData = await dmTestnonCardProbHandlerdata.dmTestnonCardProbHandler({ body });
            return responseData;
        })
    });
    app.post('/api/dm-train-noncardProb', async(req, res, next) => {
        const body = req.body;
        baseCtrl.postAsync(req, res, next, async(_) => {
            const responseData = await dmTrainnonCardProbHandlerdata.dmTrainnonCardProbHandler({ body });
            return responseData;
        })
    });
    app.post('/api/test_train_plot', async(req, res, next) => {
        const body = req.body;
        // const customHeaders = req.customHeaders;
        
        baseCtrl.postAsync(req, res, next, async (_) => {
            const responseData = await TestTrainHandler.testTrainHandler({ body });
            return responseData;
        })
    });

    app.post('/api/segment_train', async(req, res, next) => {
        const body = req.body;
        // const customHeaders = req.customHeaders;
        
        baseCtrl.postAsync(req, res, next, async (_) => {
            const responseData = await segmentDensityHandler.segmentDensityHandler({ body });
            return responseData;
        })
    });
    app.post('/api/segment_test', async(req, res, next) => {
        const body = req.body;
        // const customHeaders = req.customHeaders;
        
        baseCtrl.postAsync(req, res, next, async (_) => {
            const responseData = await segmentDensityTestHandler.segmentDensityTestHandler({ body });
            return responseData;
        })
    });

    app.post('/api/segmentFilter_train', async(req, res, next) => {
        const body = req.body;
        // const customHeaders = req.customHeaders;
        
        baseCtrl.postAsync(req, res, next, async (_) => {
            const responseData = await segmentDensityHandler.segmentDensitySegmentFilterHandler({ body });
            return responseData;
        })
    });
    app.post('/api/segmentFilter_test', async(req, res, next) => {
        const body = req.body;
        // const customHeaders = req.customHeaders;
        
        baseCtrl.postAsync(req, res, next, async (_) => {
            const responseData = await segmentDensityTestHandler.segmentDensityTestSegmentFilterHandler({ body });
            return responseData;
        })
    });
    
}
