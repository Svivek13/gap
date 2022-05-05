
const mongoose = require('mongoose');

const { CONSTANTS } = require('../helpers/constant');
const { get: _get } = require('lodash');



let acitvitySchema = mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    dependsOn:[
        {
            activity: { type: String, required: true },
            dependencyConditions: [{ type: String }]
        }
    ],
    LogicalActivityType: { type: String },
    // policy: { type: mongoose.Schema.Types.Mixed },
    // userProperties: [{ type:  mongoose.Schema.Types.Mixed }],
    
    typeProperties: { type:  mongoose.Schema.Types.Mixed },
    inputs: { type: [{ type:  mongoose.Schema.Types.Mixed }], default: undefined},
    outputs: [{ type:  mongoose.Schema.Types.Mixed }]
});




// let typePropertiesSchema = mongoose.Schema({
//     source: { type:  mongoose.Schema.Types.Mixed },
//     sinK: { type:  mongoose.Schema.Types.Mixed },
//     enableStaging: { type:  mongoose.Schema.Types.Mixed },
//     activities: [acitvitySchema]
// });

// acitvitySchema.add({ ['typeProperties.activities']: [acitvitySchema]});

// typePropertiesSchema.add({ activities: [acitvitySchema] });

let pipelineSchema = mongoose.Schema({
    _id: { type: String },
    etag: { type: String },
    id: { type: String },
    name: { type: String, required: true },
    properties: {
        // annotations: [{ type: mongoose.Schema.Types.Mixed }],
        // description: { type: String },
        activities: [acitvitySchema]

    },
    type: { type: String },
    // parent: { type: Boolean },
    // bu: { type: Boolean },
    // ds: { type: Boolean },
    // prophet_misc_metric_pipeline: { type: String }

});


const PipelineStorage = mongoose.model('Pipelines', pipelineSchema, _get(CONSTANTS, 'collectionName.pipeline'));


const pipelineFindOne = getFields => PipelineStorage.findOne(getFields);
const pipelineFind = ({ getFields }) => PipelineStorage.find(getFields);
// const pipelineFindDesc = ({ getFields }) => PipelineStorage.find(getFields).sort({ })



module.exports = {
    pipelineFindOne,
    pipelineFind,
};
