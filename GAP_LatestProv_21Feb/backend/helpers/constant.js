const CONSTANTS = Object.freeze({
    pipelineCategory: {
        adfPipeline: 'Microsoft.DataFactory/factories/pipelines',
        dbNoteBookPipeline: 'DBNotebook',
        default: 'Microsoft.DataFactory/factories/pipelines',
    },
    complexGraph: {
        ExecutePipeline: 'adfPipeline',
        DatabricksNotebook: 'dbNoteBookPipeline'
    },
    roles: {
        dataScientist: 'Data Scientist',
        businessUser: 'Business User',
        dataEngineer: 'Data Engineer',
    },
    userRoles: [
        'member',
        'admin'
    ],
    fileName: {
        parameter: 'parameters_df',
        qc: 'qc_df'
    },
    mainPipeline: {
        name: 'Sequential_Run'
    },
    status: {
        success: "Succeeded",
        inProgress: "InProgress"
    },
    BUHealthScore: {
        pipelineName: 'ADS_to_Refresh'
    },
    dataEngineer: {
        pipelineRuns: {
            id: 'mog-kc-dev_PipelineToLoad_Baseline_Master_Static_Data_TPE_copy1_adf',
            name: 'PipelineToLoad_Baseline_Master_Static_Data_TPE_copy1'
        }
    },
    noOfDropdownYear: 20,
    months: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ],
    collectionName: {
        // pipeline: 'pipelines_load_test',
        // pipelineRun: 'PipelineRuns_load_test',
        // activityRuns: 'ActivityRuns_load_test',
        // dataDrift: 'data_drift_metrics',
        // countryMapping: 'CountryCodeMapping',
        // distributorMapping: 'country_distributor_mapping',
        // filedMetric: 'FiledMetrics_load_test',
        // skuMapping: 'Distributor_Sku_Mapping',
        // users: 'users',
        // dataDriftTest: 'data_drift_test',
        // dataDriftTrain: 'data_drift_train'

        pipeline: 'Pipelines',
        pipelineRun: 'PipelineRuns',
        activityRuns: 'ActivityRuns',
        dataDrift: 'data_drift_metrics',
        countryMapping: 'CountryCodeMapping',
        distributorMapping: 'country_distributor_mapping',
        filedMetric: 'FiledMetrics',
        skuMapping: 'Distributor_Sku_Mapping',
        users: 'users',
       // dataDriftTest: 'data_drift_test',
      //  dataDriftTrain: 'data_drift_train',
        dataEngineerMetric: 'DE_Metrics',
        project: 'Projects',
        projectExecutions: 'ProjectExecutions',
        projectOutputs: 'ProjectOutputs',
        projectsAdmin: 'ProjectsAdmin',
        projectOutputsAdmin: 'ProjectOutputsAdmin',
        projectExecutionsAdmin: 'ProjectExecutionsAdmin',
        buMetric: 'BUMetrics',
        deMetric: 'DEMetrics',
        faq: 'faq',
        supportTicket: 'supportTickets',
        trackingMetrics: 'TrackingMetrics',
        trackingMetricsDesc: 'TrackingMetricsDesc',
        trackingMetricsEvent: 'TrackingMetricsEvent',
        metadata: 'Metadata',
        invitations: 'Invitations',
        DataEngMetrics: 'DataEngMetrics',
        Syndication_Check: 'Syndication_Check',
        DataEngMetricsDrillDown: 'DataEngMetricsDrillDown',
        DataEnggMetrics: 'DataEnggMetrics',
        graph_poc: 'graph_poc',
        temp_DM: 'temp_DM',
        DM_drift_results: 'DM_drift_results',
        DM_train_card_prob: 'DM_train_card_prob',
        DM_test_card_prob: 'DM_test_card_prob',
        DM_train_card_rev: 'DM_train_card_rev',
        DM_test_card_rev: 'DM_test_card_rev',
        DM_test_noncard_prob: 'DM_test_noncard_prob',
        DM_train_noncard_prob: 'DM_train_noncard_prob',
        DM_test_noncard_rev: 'DM_test_noncard_rev',
        DM_train_noncard_rev: 'DM_train_noncard_rev',
        DQ_Completeness: 'DQ_Completeness',
        DQ_Uniqueness: 'DQ_Uniqueness',
        DQ_Uniqueness_Modified: 'DQ_Uniqueness_Modified',
        ProjectMain:'ProjectMain',
        dataDrift:'dataDrift',
        dataDriftTest:'dataDriftTest',
        dataDriftTrain:'dataDriftTrain',
        explainableAI_temp:'explainableAI_temp',
        explainableAI:'explainableAI',
        DQ_Timeliness:'DQ_Timeliness',
        dataDriftSegmentTest:'dataDriftSegmentTest',
        dataDriftSegmentTrain:'dataDriftSegmentTrain'

    },
    security: {
        privateKey: "-----BEGIN RSA PRIVATE KEY-----\nMIICXgIBAAKBgQDAXLvSlA2SY79xGzNohCoaqajvlvmAg7wQwqxjWX+hgqD4CbZl\nxvCHFVdb3KdMBQ1gLlQKEXBbHO7PzVxdS6kATYLfZLobJttJSsm/YMAjPy5F6iOl\nonpk3bG+M6YHGC/meFrqL1YOeoleMy9piEU2TRcoyIOldR0J9m5fBvDGHQIDAQAB\nAoGBAK1jqUUhgK5ATPKlwwvlfZI09XqoylLF64HsB7kxlfK+LVwGXSuWS35nhSvf\nU8kZELpuZ///QhhOlxAmGqhZp4V07YOn53XBCLKPrkdkmxY1hhtkribCwWzuA2Ev\nNTDSogy2R3hzNxX/UyG0GcnStGc+dWVR5Y3OThTdZGUAvPfdAkEA92HFtUH/5feq\nVLK7WaQIs7hLW4PSY5r4DvdFfwdlhqOMiTntGswRQrFHPbRM2bqsTVvdtHbj/DKi\nnopht1fk2wJBAMcQR23nwmUPVxuzvIp1sqFsGk98RS5lQMEelx3JTd2MKdjIrv57\nn0xR5Qe+t4P/PUbxeAViqZPNSiieSkegtmcCQQCjUsW4+a39IhoueSH/+LBWFyKJ\ndOp+IF4NY2tahoOc9HVgVAIaYwgyQ+CI+HSUew4utKwW7Tdv1e5PRYVmCn1pAkEA\nudnOBqOhj/7xgfCeL9tRSnqGWf2ZDYcFHQi1Z97hLt5E15wOHZRHltbC8SczaS5t\nBIY/Wy/RSSgae6/Fg/hdMwJAMvdXadtzJv+sShJI88Czq2RN6s0Uq16zjq9l4jaK\nlAQrnOZUoKagntzQMv/Ko+q00hg8Qb+6Qtl8wDRz+UaDTw==\n-----END RSA PRIVATE KEY-----",
        tokenExpiryTime: '24h',
        publicKey: "-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDAXLvSlA2SY79xGzNohCoaqajv\nlvmAg7wQwqxjWX+hgqD4CbZlxvCHFVdb3KdMBQ1gLlQKEXBbHO7PzVxdS6kATYLf\nZLobJttJSsm/YMAjPy5F6iOlonpk3bG+M6YHGC/meFrqL1YOeoleMy9piEU2TRco\nyIOldR0J9m5fBvDGHQIDAQAB\n-----END PUBLIC KEY-----",
    },
    routes: {
        exemptedRoutes: ['/api/user/signup', '/api/user/login', '/api/user/verify', '/api/user/resend/email', '/api/user/reset/password/request', '/api/user/reset/password', '/api/email/send', '/api/doc/meta/file', '/api/meta/data'],
    },
    fileType: {
        csv: "text/csv",
        json: "application/json",
        excel: "application/vnd.ms-excel"
    },
    permittedExecutionTypes: ['drift', 'explainability'],
    permittedModelTypes: ['regression', 'classification', 'time-series'],
    permittedProjectTypes: ['admin', 'non-admin'],
    templateEmailSubjects: {
        userSignUp: "[ML Works] Welcome Onboard! Your account is verified",
        invitation: "[ML Works] Invitation for ML Works!",
        confirmation: "[ML Works] Please verify your account",
        resetPassword: "[ML Works] Please reset your password",
        JobCompletion: "[ML Works] Execution Status",
        resetPasswordConfirmation: "[ML Works] Reset password confirmation"
    },
    relativePathOfTemplate: {
        user: '/backend/mailTemplates/user',
        execution: '/backend/mailTemplates/execution',


    },
    templateWords: {
        JobCompletion: {
            Success: 'successfully completed',
            Fail: "terminated due to error"
        }
    }
});

module.exports = {
    CONSTANTS
}
