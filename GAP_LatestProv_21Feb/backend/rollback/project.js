const { get: _get } = require('lodash');
const { deleteProject } = require('../models/project');
const { deleteProjectExecution } = require('../models/projectExecution');
const { deleteProjectOutput } = require('../models/projectOutput');

const projectDelete = async ({ data, iteration = 0 }) => {
    const iter = iteration
    try {
        // if (iter < 2) {
        //     console.log('project error');
        //     throw {error: "testing"};
        // }
        // console.log(data, 'project');
        await deleteProject({ _id: _get(data, '_id') });
    } catch (err) {
        const iteration = iter;
        if (iteration < 3) {
            setTimeout((iter = iteration) => {
                projectDelete({ data, iteration: iter + 1 });
            }, 1000);
        }
        
    }
};

const projectExecDelete = async ({ data, iteration = 0 }) => {
    const iter = iteration;
    try {
        // if (iter < 2) {
        //     console.log('project exec error');
        //     throw {error: "testing"};
        // }
        // console.log(data, 'execution');
        await deleteProjectExecution({ _id: _get(data, '_id') });
    } catch (err) {
        const iteration = iter;
        if (iteration < 3) {
            setTimeout((iter = iteration) => {
                projectExecDelete({ data, iteration: iter + 1 });
            }, 1000);
        }
        
    }
};

const projectOutputDelete = async ({ data, iteration = 0 }) => {
    const iter = iteration;
    try {
        // if (iter < 2) {
        //     console.log('project output error');
        //     throw {error: "testing"};
        // }
        // console.log( data, 'project output');
        await deleteProjectOutput({ _id: _get(data, '_id') });
    } catch (err) {
        const iteration = iter;
        if (iteration < 3) {
            setTimeout((iter = iteration ) => {
                projectOutputDelete({ data, iteration: iter + 1 });
            }, 1000);
        }
        
    }
};


const rollbackCreateProject = async ({ data }) => {
    if (_get(data, 'projectRes')) {
        await projectDelete({ data: _get(data, 'projectRes') });
    }
    if (_get(data, 'projectExecRes')) {
        await projectExecDelete({ data: _get(data, 'projectExecRes') });
    }

    if (_get(data, 'projectOutputRes')) {
        await projectOutputDelete({ data: _get(data, 'projectOutputRes') });
    }
    
}

module.exports = {
    rollbackCreateProject,
}