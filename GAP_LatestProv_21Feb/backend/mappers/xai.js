const { get: _get, map: _map, isEmpty: _isEmpty, isFinite: _isFinite } = require('lodash');
const { cleanEntityData } = require("../helpers/commonUtils");

const mapXaiReqResponse = ({ data }) => {
    const global_exp = _get(data, "xai_output.global_exp");
    const global_exp_res = [];
    if (global_exp) {
        global_exp.forEach(element => {
            let obj = {};
            obj.label = element[0];
            obj.value = element[1];
            global_exp_res.push(obj);
        });
    }

    global_exp_res.sort(function (a, b) {
        return b.value - a.value;
    });

    return cleanEntityData({
        projectId: _get(data, "projectId"),
        execId: _get(data, "execId"),
        global_exp: global_exp_res
    });
}

const getRefreshPair = (localExpObj, xAxis, yAxis) => {
    const allowed = [xAxis, yAxis];

    const filtered = Object.keys(localExpObj)
      .filter(key => allowed.includes(key))
      .reduce((obj, key) => {
        obj[key] = localExpObj[key];
        return obj;
      }, {});
    
    console.log("localExpObj: ", localExpObj);
    console.log("filtered: ", filtered);
    // {
    //     "Pclass": {
    //         "exp": -0.13272505991871106,
    //         "raw": 1
    //     },
    //     "Sex": {
    //         "exp": -0.2942323679730773,
    //         "raw": 0
    //     }
    // }
    for (const [key, value] of Object.entries(filtered)) {
        console.log(`${key}: ${value}`);
        filtered[key] = value["raw"];
    }
    return filtered;
}

const extractExp = (obj) => {
    // obj = {
    //     "Pclass": {
    //         "exp": -0.12818724183897365,
    //         "raw": 1
    //     },
    //     "Sex": {
    //         "exp": -0.2861495296198319,
    //         "raw": 0
    //     },
    //     "Age": {
    //         "exp": -0.023799714408842907,
    //         "raw": 17
    //     },
    //     "SibSp": {
    //         "exp": 0.007481590175416556,
    //         "raw": 1
    //     },
    //     "Parch": {
    //         "exp": -0.0022176102347553316,
    //         "raw": 0
    //     },
    //     "Fare": {
    //         "exp": -0.1012898200882606,
    //         "raw": 108.9
    //     },
    //     "Embarked": {
    //         "exp": -0.0353507825989901,
    //         "raw": 0
    //     }
    // }

    for (const [key, value] of Object.entries(obj)) {
        if (!value || !value.exp) {
            console.log('gadbad: ', value);
        }
        console.log(`extractExp ${key}: ${value.exp}`);
        obj[key] = value["exp"];
    }
    return obj;
}

const mapXaiScatterReqResponse = ({ data, xAxis, yAxis }) => {
    const global_exp = _get(data, "xai_output.global_exp");
    if (!global_exp) {
        return;
    }
    const featuresList = global_exp.map(item => item[0]);

    const raw_startified_id_list = _get(data, "xai_output.startified_id")
    const result_startified_id_list = [];
    let availableCombinations = [];
    Object.keys(raw_startified_id_list).forEach(function(key, idx) {
        console.log(key)
        // ('Sex', 'Pclass', 0)
        let modified_key = key.substring(1, key.length-1)
        let modified_key_xAxis = modified_key.split(',')[0].trim();
        modified_key_xAxis = modified_key_xAxis.substring(1, modified_key_xAxis.length-1)
        let modified_key_yAxis = modified_key.split(',')[1].trim();
        modified_key_yAxis = modified_key_yAxis.substring(1, modified_key_yAxis.length-1)
        console.log(modified_key_xAxis, " ", modified_key_yAxis);
        if (availableCombinations.indexOf(`${modified_key_xAxis},${modified_key_yAxis}`) === -1) {
            availableCombinations.push(`${modified_key_xAxis},${modified_key_yAxis}`)
        }
        if (modified_key_xAxis === xAxis && modified_key_yAxis === yAxis) {
            result_startified_id_list.push(raw_startified_id_list[key]) // change key old original
        }
     });
    // console.log("result startified list: ", result_startified_id_list);
    // 5 array ka list mila, ab aage

    const local_exp = _get(data, "xai_output.local_exp");

    let thisRefreshPairs = [], result_startified_pairs_list = [];
    result_startified_id_list.forEach((thisRefreshIndices, index) => {
        console.log(`result_startified_id_list.forEach: ${thisRefreshIndices}, ${index}`);
        // each index will give x, y pair
        thisRefreshPairs.length = 0;
        thisRefreshIndices.forEach((item, index) => {
            console.log(`thisRefreshIndices.forEach: , ${item}, ${index}`);
            thisRefreshPairs.push({
                point: getRefreshPair(_get(local_exp, item), xAxis, yAxis),
                // localXAI: extractExp(_get(local_exp, item)) // do this later
                localXAI: _get(local_exp, item)
            })
        })

        result_startified_pairs_list.push(thisRefreshPairs);
    })

    // console.log("result_startified_pairs_list: ", result_startified_pairs_list)

    // console.log("local_exp: ", _get(data, "xai_output.local_exp"));
    return cleanEntityData({
        projectId: _get(data, "projectId"),
        execId: _get(data, "execId"),
        featuresList,
        availableCombinations,
        scatterPlotData: result_startified_pairs_list,
    })
};

module.exports = {
    mapXaiReqResponse,
    mapXaiScatterReqResponse
}
