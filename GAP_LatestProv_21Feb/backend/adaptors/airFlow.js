const { get: _get } = require('lodash');
const { post: httpClientPost } = require('../private/http-client');

const { env }  = require("../config/env");

const { makeUrl, cleanEntityData } = require("../helpers/commonUtils");

// const { makeUrl } = require('../helper/commonUtil');

const baseUrl = _get(env, 'dagUrl')
// http://mlw-lite-airflow-web.eastus2.cloudapp.azure.com:8080/
// explainability_dag_id = ExplainabilityDAG
// drift_dag_id = DriftDag_1

const projectExecAdaptor = async ({ data }) => {
    
    // throw { error : {statusCode: '404', message: "testing "}};
    const relativeUrl = 'api/experimental/dags/Drift/dag_runs';
    const url = makeUrl(baseUrl, [`${relativeUrl}`]);
    // console.log("drift url here: ", url)

    
    // const headers = [{
    //     name: 'Content-Type',
    //     value: 'application/x-www-form-urlencoded',  
    // }];

    const headers = [];

   
    // string null to be sent for empty values
    // notifyUser field discussion
    const body = cleanEntityData({
        "conf": {
            "value": [
                {
                    "exec_id": _get(data, 'execId'),
                    "project_id": _get(data, 'projectId'),
                    "details": {
                        "target_column": _get(data, 'target'),
                        "train_file": _get(data, 'trainFilePath'),
                        "test_file": _get(data, 'testFilePath'),
                        "recipientEmail": _get(data, 'userEmail'),
                        "userId": _get(data, 'userId'),
                    }
                }
            ]
        }
    });
    
    console.log( JSON.stringify(body), data);
    console.log("drift dagUrl here: ", url)
    const response = await httpClientPost(url, body, headers);
    return response;


};

const xaiRunAdaptor = async ({ data }) => {
    const relativeUrl = 'api/experimental/dags/Explainability/dag_runs';
    const url = makeUrl(baseUrl, [`${relativeUrl}`]);
    // console.log("xai url here: ", url)
    const headers = [];
   
    // notifyUser field discussion
    const body = cleanEntityData({
        "conf": {
            "value": [
                {
                    "exec_id": _get(data, 'execId'),
                    "project_id": _get(data, 'projectId'),
                    "details": {
                        "test_file": _get(data, 'test_file'),
                        "pickle_file": _get(data, 'pickle_file'),
                        "mode": _get(data, 'mode'),
                        "categorical_features": _get(data, 'categorical_features'), // list of indexes starting with 0 or 'null'
                        "target_column": _get(data, 'target_column'),
                        "class_names": _get(data, 'class_names'), // list of strings or string "null"
                        "recipientEmail": _get(data, 'userEmail'),
                        "userId": _get(data, 'userId'),
                    }
                }
            ]
        }
    });

    const response = await httpClientPost(url, body, headers);
    return response;


};




module.exports = {
    projectExecAdaptor,
    xaiRunAdaptor
}