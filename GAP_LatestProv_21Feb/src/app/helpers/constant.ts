const CONSTANTS = {
    status: {
        // success: 'Succeeded',
        // fail: 'Failed',
        // cancel: 'Cancelled',
        // inProgress: 'InProgress'
        success: 'succeeded',
        fail: 'failed',
        cancel: 'cancelled',
        inProgress: 'inprogress'
    },
    statusIcon: {
        success: 'fa:fa-check-circle-o',
        fail: 'fa:fa-times-circle-o',
        cancel: 'fa:fa-ban',
        inProgress: 'fa:fa-spinner'

    },
    collapseControlIcon: {
        expand: 'fa:fa-plus-circle',
        collapse: 'fa:fa-minus-circle',
    },
    activityType: {
        dataImport: 'Data Import',
        dataTransform: 'Data Transform',
        dataTrainer: 'Data Trainer',
        dataExport: 'Data Export',
        dataEvaluator: 'Data Evaluator'
    },
    activityTypeIcon: {
        'Data Import': 'fa:fa-database',
        'Data Transform': 'fa:fa-tasks',
        'Data Trainer': 'fa:fa-cogs',
        'Data Export': 'fa:fa-pencil-square-o',
        'Data Evaluator': 'fa:fa-flag-checkered',
        Preprocess: 'fa:fa-tasks',
        'Push to Blob': 'fa:fa-cloud-upload',

        'Reading the Source': 'fa:fa-files-o',
        'Data transformation': 'fa:fa-cogs',
        'Loading to Destination': 'fa:fa-cloud-upload',
        'Pre-processing': 'fa:fa-filter',
        'Misc': 'fa:fa-tags',

        'Data Movement Activity': 'fa:fa-files-o',
        'General Activity': 'fa:fa-tasks',
        'Iteration & Conditionals Activity' : 'fa:fa-repeat',
        'DataBricks Activity': 'fa:fa-cloud-upload'


        // dataImport: 'fa:fa-database',
        // dataTransform: 'fa:fa-tasks',
        // dataTrainer: 'fa:fa-cogs',
        // dataExport: 'fa:fa-pencil-square-o',
        // dataEvaluator: 'fa:fa-flag-checkered',
    },
    nodes: {
        dataBrickNode: 'DatabricksNotebook',
        adfNode: 'ExecutePipeline'
    },
    pipelineCategory: {
        adfPipeline: 'Microsoft.DataFactory/factories/pipelines',
        dbNoteBookPipeline: 'DBNotebook',
    },
    pdfType: {
        termsandcondition: {
            name: 'termsAndCondition',
            header: "END USER LICENSE AGREEMENT",
        },
        drift: {
            name: 'drift',
            header: "DRIFT",
        },
        explainability: {
            name: 'explainability',
            header: "EXPLAINABILITY",
        },
        model: {
            name: 'model',
            header: "MODELS",
        },
        preprocessedData: {
            name: 'preprocessedData',
            header: "PREPROCESSED",
        },
        persona: {
            name: 'persona',
            header: "PERSONA",
        },
        provenance: {
            name: 'provenance',
            header: "PROVENANCE",
        }
    }
};

export {
    CONSTANTS,
};
