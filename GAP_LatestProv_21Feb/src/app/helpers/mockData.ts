const mockData2 = {
    data: {
      name: 'pipeline3',
      properties: {
        activities: [
          {
            nodeId: '0b976d',
            name: 'KC Base Sellin Pipeline',
            type: 'ADF',
            status: 'Succeeded',
            isExpanded: false,
            expandable: false
          },
          {
            nodeId: '716cc8',
            dependsOn: [
              {
                activity: 'KC Base Sellin Pipeline',
                dependencyConditions: 'Succeeded'
              }
            ],
            name: 'Blob_To_ADS',
            type: 'DatabricksNotebook',
            status: 'Succeeded',
            isExpanded: false,
            expandable: true
          },
          {
            nodeId: '716c234',
            dependsOn: [
              {
                activity: 'Blob_To_ADS',
                dependencyConditions: 'Succeeded'
              }
            ],
            name: 'ADS_To_ML_Modelling_Refresh',
            type: 'DatabricksNotebook',
            status: 'Succeeded',
            isExpanded: false,
            expandable: true
          },
          {
            parentNodeId: '716cc8',
            nodeId: 'fe708e',
            name: 'Read Data',
            type: 'Data Import',
            status: 'Succeeded',
            isExpanded: false,
            expandable: false
          },
          {
            nodeId: '664a6b',
            parentNodeId: '716cc8',
            dependsOn: [
              {
                activity: 'Read Data',
                dependencyConditions: 'Succeeded'
              }
            ],
            name: 'Aggregate Sellin Data',
            type: 'Data Transform',
            status: 'Succeeded',
            isExpanded: false,
            expandable: false
          },
          {
            nodeId: '6fa4d4',
            parentNodeId: '716cc8',
            dependsOn: [
              {
                activity: 'Read Data',
                dependencyConditions: 'Succeeded'
              }
            ],
            name: 'Aggregate Sellout Data',
            type: 'Data Transform',
            isExpanded: false,
            expandable: false
          },
          {
            nodeId: 'a7ae20',
            parentNodeId: '716cc8',
            dependsOn: [
              {
                activity: 'Read Data',
                dependencyConditions: 'Succeeded'
              }
            ],
            name: 'promo_data_aggregation',
            type: 'Data Transform',
            status: 'Succeeded',
            isExpanded: false,
            expandable: false
          },
          {
            nodeId: '1e209a',
            parentNodeId: '716cc8',
            dependsOn: [
              {
                activity: 'Aggregate Sellout Data',
                dependencyConditions: 'Succeeded'
              }
            ],
            name: 'aggregate_excluded_dataset_sellout',
            type: 'Preprocess',
            isExpanded: false,
            expandable: false
          },
          {
            nodeId: 'b20376',
            parentNodeId: '716cc8',
            dependsOn: [
              {
                activity: 'Aggregate Sellin Data',
                dependencyConditions: 'Succeeded'
              }
            ],
            name: 'aggregate_excluded_dataset_sellin',
            type: 'Preprocess',
            status: 'Succeeded',
            isExpanded: false,
            expandable: false
          },
          {
            nodeId: '997dda',
            parentNodeId: '716cc8',
            dependsOn: [
              {
                activity: 'aggregate_excluded_dataset_sellout',
                dependencyConditions: 'Succeeded'
              },
              {
                activity: 'aggregate_excluded_dataset_sellin',
                dependencyConditions: 'Succeeded'
              }
            ],
            name: 'Prepare Baseline and Excluded Aggregated',
            type: 'Data Transform',
            status: 'Succeeded',
            isExpanded: false,
            expandable: false
          },
          {
            nodeId: '520af7',
            parentNodeId: '716cc8',
            dependsOn: [
              {
                activity: 'Prepare Baseline and Excluded Aggregated',
                dependencyConditions: 'Succeeded'
              }
            ],
            name: 'filtering_dataset_for_cutoffdate',
            type: 'Data Transform',
            status: 'Succeeded',
            isExpanded: false,
            expandable: false
          },
          {
            nodeId: '746117',
            parentNodeId: '716cc8',
            dependsOn: [
              {
                activity: 'filtering_dataset_for_cutoffdate',
                dependencyConditions: 'Succeeded'
              }
            ],
            name: 'Column Mapping for Intersections',
            type: 'Data Transform',
            status: 'Succeeded',
            isExpanded: false,
            expandable: false
          },
          {
            nodeId: '0b944c',
            parentNodeId: '716cc8',
            dependsOn: [
              {
                activity: 'Column Mapping for Intersections',
                dependencyConditions: 'Succeeded'
              },
              {
                activity: 'filtering_dataset_for_cutoffdate',
                dependencyConditions: 'Succeeded'
              }
            ],
            name: 'Excluded intersections dataset',
            type: 'Data Transform',
            status: 'Succeeded',
            isExpanded: false,
            expandable: false
          },
          {
            nodeId: '69cb28',
            parentNodeId: '716cc8',
            dependsOn: [
              {
                activity: 'Excluded intersections dataset',
                dependencyConditions: 'Succeeded'
              },
              {
                activity: 'filtering_dataset_for_cutoffdate',
                dependencyConditions: 'Succeeded'
              }
            ],
            name: 'Prepare Master Dataframe Calendar',
            type: 'Data Transform',
            status: 'Succeeded',
            isExpanded: false,
            expandable: false
          },
          {
            nodeId: '02c7f6',
            parentNodeId: '716cc8',
            dependsOn: [
              {
                activity: 'create_analytical_dataset',
                dependencyConditions: 'Succeeded'
              }
            ],
            name: 'Write Output',
            type: 'Push to Blob',
            status: 'Succeeded',
            isExpanded: false,
            expandable: false
          },
          {
            nodeId: '46e3f0',
            parentNodeId: '716cc8',
            dependsOn: [
              {
                activity: 'filtering_dataset_for_cutoffdate',
                dependencyConditions: 'Succeeded'
              },
              {
                activity: 'promo_data_aggregation',
                dependencyConditions: 'Succeeded'
              },
              {
                activity: 'Prepare Master Dataframe Calendar',
                dependencyConditions: 'Succeeded'
              },
              {
                dependencyConditions: 'Succeeded'
              }
            ],
            name: 'create_analytical_dataset',
            type: 'Data Transform',
            status: 'Succeeded',
            isExpanded: false,
            expandable: false
          },
          {
            nodeId: '596596',
            parentNodeId: '716c234',
            name: 'Read Data',
            type: 'Data Import',
            status: 'Succeeded',
            isExpanded: false,
            expandable: false
          },
          {
            nodeId: '1ff4ae',
            parentNodeId: '716c234',
            dependsOn: [
              {
                activity: 'Read Data',
                dependencyConditions: 'Succeeded'
              }
            ],
            name: 'Aggregate Sellin Data',
            type: 'Data Transform',
            status: 'Succeeded',
            isExpanded: false,
            expandable: false
          },
          {
            nodeId: '37ad1a',
            parentNodeId: '716c234',
            dependsOn: [
              {
                activity: 'Read Data',
                dependencyConditions: 'Succeeded'
              }
            ],
            name: 'Aggregate Sellout Data',
            type: 'Data Transform',
            isExpanded: false,
            expandable: false
          },
          {
            nodeId: 'e02356',
            parentNodeId: '716c234',
            dependsOn: [
              {
                activity: 'Read Data',
                dependencyConditions: 'Succeeded'
              }
            ],
            name: 'promo_data_aggregation',
            type: 'Data Transform',
            status: 'Succeeded',
            isExpanded: false,
            expandable: false
          },
          {
            nodeId: '78be55',
            parentNodeId: '716c234',
            dependsOn: [
              {
                activity: 'Aggregate Sellout Data',
                dependencyConditions: 'Succeeded'
              }
            ],
            name: 'aggregate_excluded_dataset_sellout',
            type: 'Preprocess',
            isExpanded: false,
            expandable: false
          },
          {
            nodeId: '238c72',
            parentNodeId: '716c234',
            dependsOn: [
              {
                activity: 'Aggregate Sellin Data',
                dependencyConditions: 'Succeeded'
              }
            ],
            name: 'aggregate_excluded_dataset_sellin',
            type: 'Preprocess',
            status: 'Succeeded',
            isExpanded: false,
            expandable: false
          },
          {
            nodeId: '0b5aff',
            parentNodeId: '716c234',
            dependsOn: [
              {
                activity: 'aggregate_excluded_dataset_sellout',
                dependencyConditions: 'Succeeded'
              },
              {
                activity: 'aggregate_excluded_dataset_sellin',
                dependencyConditions: 'Succeeded'
              }
            ],
            name: 'Prepare Baseline and Excluded Aggregated',
            type: 'Data Transform',
            status: 'Succeeded',
            isExpanded: false,
            expandable: false
          },
          {
            nodeId: 'a25104',
            parentNodeId: '716c234',
            dependsOn: [
              {
                activity: 'Prepare Baseline and Excluded Aggregated',
                dependencyConditions: 'Succeeded'
              }
            ],
            name: 'filtering_dataset_for_cutoffdate',
            type: 'Data Transform',
            status: 'Succeeded',
            isExpanded: false,
            expandable: false
          },
          {
            nodeId: '5008cd',
            parentNodeId: '716c234',
            dependsOn: [
              {
                activity: 'filtering_dataset_for_cutoffdate',
                dependencyConditions: 'Succeeded'
              }
            ],
            name: 'Column Mapping for Intersections',
            type: 'Data Transform',
            status: 'Succeeded',
            isExpanded: false,
            expandable: false
          },
          {
            nodeId: '28802d',
            parentNodeId: '716c234',
            dependsOn: [
              {
                activity: 'Column Mapping for Intersections',
                dependencyConditions: 'Succeeded'
              },
              {
                activity: 'filtering_dataset_for_cutoffdate',
                dependencyConditions: 'Succeeded'
              }
            ],
            name: 'Excluded intersections dataset',
            type: 'Data Transform',
            status: 'Succeeded',
            isExpanded: false,
            expandable: false
          },
          {
            nodeId: '8ed07b',
            parentNodeId: '716c234',
            dependsOn: [
              {
                activity: 'Excluded intersections dataset',
                dependencyConditions: 'Succeeded'
              },
              {
                activity: 'filtering_dataset_for_cutoffdate',
                dependencyConditions: 'Succeeded'
              }
            ],
            name: 'Prepare Master Dataframe Calendar',
            type: 'Data Transform',
            status: 'Succeeded',
            isExpanded: false,
            expandable: false
          },
          {
            nodeId: 'd38f6e',
            parentNodeId: '716c234',
            dependsOn: [
              {
                activity: 'create_analytical_dataset',
                dependencyConditions: 'Succeeded'
              }
            ],
            name: 'Write Output',
            type: 'Push to Blob',
            status: 'Succeeded',
            isExpanded: false,
            expandable: false
          },
          {
            nodeId: '69f5f2',
            parentNodeId: '716c234',
            dependsOn: [
              {
                activity: 'filtering_dataset_for_cutoffdate',
                dependencyConditions: 'Succeeded'
              },
              {
                activity: 'promo_data_aggregation',
                dependencyConditions: 'Succeeded'
              },
              {
                activity: 'Prepare Master Dataframe Calendar',
                dependencyConditions: 'Succeeded'
              },
              {
                dependencyConditions: 'Succeeded'
              }
            ],
            name: 'create_analytical_dataset',
            type: 'Data Transform',
            status: 'Succeeded',
            isExpanded: false,
            expandable: false
          }
        ]
      }
    }
  };


const mockData3 = {
  data: {
    name: 'pipeline3',
    properties: {
      activities: [
        {
          nodeId: '0b976d',
          name: 'KC Base Sellin Pipeline',
          type: 'ADF',
          status: 'Succeeded',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: '716cc8',
          dependsOn: [
            {
              activity: 'KC Base Sellin Pipeline',
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'Blob_To_ADS',
          type: 'DatabricksNotebook',
          status: 'Succeeded',
          isExpanded: false,
          expandable: true
        },
        {
          nodeId: '716c234',
          dependsOn: [
            {
              activity: 'Blob_To_ADS',
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'ADS_To_ML_Modelling_Refresh',
          type: 'DatabricksNotebook',
          status: 'Succeeded',
          isExpanded: false,
          expandable: true
        },
        {
          parentNodeId: '716cc8',
          nodeId: 'fe708e',
          name: 'Read Data',
          type: 'Data Import',
          status: 'Succeeded',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: '664a6b',
          parentNodeId: '716cc8',
          dependsOn: [
            {
              activity: 'Read Data',
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'Aggregate Sellin Data',
          type: 'Data Transform',
          status: 'Succeeded',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: '6fa4d4',
          parentNodeId: '716cc8',
          dependsOn: [
            {
              activity: 'Read Data',
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'Aggregate Sellout Data',
          type: 'Data Transform',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: 'a7ae20',
          parentNodeId: '716cc8',
          dependsOn: [
            {
              activity: 'Read Data',
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'promo_data_aggregation',
          type: 'Data Transform',
          status: 'Succeeded',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: '1e209a',
          parentNodeId: '716cc8',
          dependsOn: [
            {
              activity: 'Aggregate Sellout Data',
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'aggregate_excluded_dataset_sellout',
          type: 'Preprocess',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: 'b20376',
          parentNodeId: '716cc8',
          dependsOn: [
            {
              activity: 'Aggregate Sellin Data',
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'aggregate_excluded_dataset_sellin',
          type: 'Preprocess',
          status: 'Succeeded',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: '997dda',
          parentNodeId: '716cc8',
          dependsOn: [
            {
              activity: 'aggregate_excluded_dataset_sellout',
              dependencyConditions: 'Succeeded'
            },
            {
              activity: 'aggregate_excluded_dataset_sellin',
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'Prepare Baseline and Excluded Aggregated',
          type: 'Data Transform',
          status: 'Succeeded',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: '520af7',
          parentNodeId: '716cc8',
          dependsOn: [
            {
              activity: 'Prepare Baseline and Excluded Aggregated',
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'filtering_dataset_for_cutoffdate',
          type: 'Data Transform',
          status: 'Succeeded',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: '746117',
          parentNodeId: '716cc8',
          dependsOn: [
            {
              activity: 'filtering_dataset_for_cutoffdate',
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'Column Mapping for Intersections',
          type: 'Data Transform',
          status: 'Succeeded',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: '0b944c',
          parentNodeId: '716cc8',
          dependsOn: [
            {
              activity: 'Column Mapping for Intersections',
              dependencyConditions: 'Succeeded'
            },
            {
              activity: 'filtering_dataset_for_cutoffdate',
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'Excluded intersections dataset',
          type: 'Data Transform',
          status: 'Succeeded',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: '69cb28',
          parentNodeId: '716cc8',
          dependsOn: [
            {
              activity: 'Excluded intersections dataset',
              dependencyConditions: 'Succeeded'
            },
            {
              activity: 'filtering_dataset_for_cutoffdate',
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'Prepare Master Dataframe Calendar',
          type: 'Data Transform',
          status: 'Succeeded',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: '02c7f6',
          parentNodeId: '716cc8',
          dependsOn: [
            {
              activity: 'create_analytical_dataset',
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'Write Output',
          type: 'Push to Blob',
          status: 'Succeeded',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: '46e3f0',
          parentNodeId: '716cc8',
          dependsOn: [
            {
              activity: 'filtering_dataset_for_cutoffdate',
              dependencyConditions: 'Succeeded'
            },
            {
              activity: 'promo_data_aggregation',
              dependencyConditions: 'Succeeded'
            },
            {
              activity: 'Prepare Master Dataframe Calendar',
              dependencyConditions: 'Succeeded'
            },
            {
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'create_analytical_dataset',
          type: 'Data Transform',
          status: 'Succeeded',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: '596596',
          parentNodeId: '716c234',
          name: 'Read Delta Tables',
          type: 'Data Import',
          status: 'Succeeded',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: '1ff4ae',
          parentNodeId: '716c234',
          name: 'Read Model Stats',
          type: 'Data Import',
          status: 'Succeeded',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: '37ad1a',
          parentNodeId: '716c234',
          dependsOn: [
            {
              activity: 'Read Model Stats',
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'Change Data Types',
          type: 'Data Transform',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: 'e02356',
          parentNodeId: '716c234',
          dependsOn: [
            {
              activity: 'Change Data Types',
              dependencyConditions: 'Succeeded'
            },
            {
              activity: 'Read Delta Tables',
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'Dataset for Input to Prophet2',
          type: 'Data Transform',
          status: 'Succeeded',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: '78be55',
          parentNodeId: '716c234',
          dependsOn: [
            {
              activity: 'Dataset for Input to Prophet2',
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'Prepare Dataset and Train',
          type: 'Data Trainer',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: '238c72',
          parentNodeId: '716c234',
          dependsOn: [
            {
              activity: 'Prepare Dataset and Train',
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'Write Output',
          type: 'Push to Blob',
          status: 'Succeeded',
          isExpanded: false,
          expandable: false
        }
      ]
    }
  }
};

const mockData1 = {
  data: {
    name: 'pipeline3',
    properties: {
      activities: [
        {
          nodeId: '0b976d',
          name: 'North America Sellin Pipeline',
          type: 'ADF',
          status: 'Succeeded',
          isExpanded: false,
          expandable: true
        },
        {
          nodeId: '716cc8',
          dependsOn: [
            {
              activity: 'North America Sellin Pipeline',
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'Blob to ADS',
          type: 'DatabricksNotebook',
          status: 'Succeeded',
          isExpanded: false,
          expandable: true
        },
        {
          nodeId: '716c234',
          dependsOn: [
            {
              activity: 'Blob to ADS',
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'ADS to ML Modelling Refresh',
          type: 'DatabricksNotebook',
          status: 'Succeeded',
          isExpanded: false,
          expandable: true
        },
        {
          parentNodeId: '716cc8',
          nodeId: 'fe708e',
          name: 'Read Data',
          type: 'Data Import',
          status: 'Succeeded',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: '664a6b',
          parentNodeId: '716cc8',
          dependsOn: [
            {
              activity: 'Read Data',
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'Aggregate Sellin Data',
          type: 'Data Transform',
          status: 'Succeeded',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: '6fa4d4',
          parentNodeId: '716cc8',
          dependsOn: [
            {
              activity: 'Read Data',
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'Aggregate Sellout Data',
          type: 'Data Transform',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: 'a7ae20',
          parentNodeId: '716cc8',
          dependsOn: [
            {
              activity: 'Read Data',
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'Promo Data Aggregation',
          type: 'Data Transform',
          status: 'Succeeded',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: '1e209a',
          parentNodeId: '716cc8',
          dependsOn: [
            {
              activity: 'Aggregate Sellout Data',
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'Aggregate Excluded Dataset Sellout',
          type: 'Preprocess',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: 'b20376',
          parentNodeId: '716cc8',
          dependsOn: [
            {
              activity: 'Aggregate Sellin Data',
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'Aggregate Excluded Dataset Sellin',
          type: 'Preprocess',
          status: 'Succeeded',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: '997dda',
          parentNodeId: '716cc8',
          dependsOn: [
            {
              activity: 'Aggregate Excluded Dataset Sellout',
              dependencyConditions: 'Succeeded'
            },
            {
              activity: 'Aggregate Excluded Dataset Sellin',
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'Prepare Baseline and Excluded Aggregated',
          type: 'Data Transform',
          status: 'Succeeded',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: '520af7',
          parentNodeId: '716cc8',
          dependsOn: [
            {
              activity: 'Prepare Baseline and Excluded Aggregated',
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'Filtering Dataset for Cutoffdate',
          type: 'Data Transform',
          status: 'Succeeded',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: '746117',
          parentNodeId: '716cc8',
          dependsOn: [
            {
              activity: 'Filtering Dataset for Cutoffdate',
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'Column Mapping for Intersections',
          type: 'Data Transform',
          status: 'Succeeded',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: '0b944c',
          parentNodeId: '716cc8',
          dependsOn: [
            {
              activity: 'Column Mapping for Intersections',
              dependencyConditions: 'Succeeded'
            },
            {
              activity: 'Filtering Dataset for Cutoffdate',
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'Excluded Intersections Dataset',
          type: 'Data Transform',
          status: 'Succeeded',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: '69cb28',
          parentNodeId: '716cc8',
          dependsOn: [
            {
              activity: 'Excluded Intersections Dataset',
              dependencyConditions: 'Succeeded'
            },
            {
              activity: 'Filtering Dataset for Cutoffdate',
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'Prepare Master Dataframe Calendar',
          type: 'Data Transform',
          status: 'Succeeded',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: '02c7f6',
          parentNodeId: '716cc8',
          dependsOn: [
            {
              activity: 'Create Analytical Dataset',
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'Write Output',
          type: 'Push to Blob',
          status: 'Succeeded',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: '46e3f0',
          parentNodeId: '716cc8',
          dependsOn: [
            {
              activity: 'Filtering Dataset for Cutoffdate',
              dependencyConditions: 'Succeeded'
            },
            {
              activity: 'Promo Data Aggregation',
              dependencyConditions: 'Succeeded'
            },
            {
              activity: 'Prepare Master Dataframe Calendar',
              dependencyConditions: 'Succeeded'
            },
            {
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'Create Analytical Dataset',
          type: 'Data Transform',
          status: 'Succeeded',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: '596596',
          parentNodeId: '716c234',
          name: 'Read Delta Tables',
          type: 'Data Import',
          status: 'Succeeded',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: '1ff4ae',
          parentNodeId: '716c234',
          name: 'Read Model Stats',
          type: 'Data Import',
          status: 'Succeeded',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: '37ad1a',
          parentNodeId: '716c234',
          dependsOn: [
            {
              activity: 'Read Model Stats',
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'Change Data Types',
          type: 'Data Transform',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: 'e02356',
          parentNodeId: '716c234',
          dependsOn: [
            {
              activity: 'Change Data Types',
              dependencyConditions: 'Succeeded'
            },
            {
              activity: 'Read Delta Tables',
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'Dataset for Input to Prophet2',
          type: 'Data Transform',
          status: 'Succeeded',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: '78be55',
          parentNodeId: '716c234',
          dependsOn: [
            {
              activity: 'Dataset for Input to Prophet2',
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'Prepare Dataset and Train',
          type: 'Data Trainer',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: '238c72',
          parentNodeId: '716c234',
          dependsOn: [
            {
              activity: 'Prepare Dataset and Train',
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'Write Output',
          type: 'Push to Blob',
          status: 'Succeeded',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: '59f90d',
          parentNodeId: '0b976d',
          name: 'Start Load Audit',
          type: 'SqlServerStoredProcedure',
          status: 'Succeeded',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: 'fa0376',
          parentNodeId: '0b976d',
          dependsOn: [
            {
              activity: 'Update Water Mark Table',
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'End Load Audit',
          type: 'SqlServerStoredProcedure',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: 'c017d7',
          parentNodeId: '0b976d',
          dependsOn: [
            {
              activity: 'Start Load Audit',
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'Lookup Old Water Mark Value',
          type: 'Lookup',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: '5160e2',
          parentNodeId: '0b976d',
          name: 'Lookup New Water Mark Value',
          type: 'Lookup',
          status: 'Succeeded',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: 'b13ff8',
          parentNodeId: '0b976d',
          dependsOn: [
            {
              activity: 'Load Country Specific to Blob',
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'Update Water Mark Table',
          type: 'SqlServerStoredProcedure',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: '87107b',
          parentNodeId: '0b976d',
          dependsOn: [
            {
              activity: 'Lookup Old Water Mark Value',
              dependencyConditions: 'Succeeded'
            },
            {
              activity: 'Lookup New Water Mark Value',
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'Load Country Specific to Blob',
          type: 'ForEach',
          isExpanded: false,
          expandable: true
        },
        {
          nodeId: '938995',
          parentNodeId: '87107b',
          dependsOn: [
            {
              activity: 'Set File Name',
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'Baseline Sellin Delta Load',
          type: 'Copy',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: '7b4c4f',
          parentNodeId: '87107b',
          dependsOn: [
            {
              activity: 'Baseline Sellin Delta Load',
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'Sellin Baseline Load Audit',
          type: 'SqlServerStoredProcedure',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: '23b4b9',
          parentNodeId: '87107b',
          dependsOn: [
            {
              activity: 'Baseline Sellin Delta Load',
              dependencyConditions: 'Failed'
            }
          ],
          name: 'Sellin Baseline Load Failure Audit',
          type: 'SqlServerStoredProcedure',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: 'c6d4d0',
          parentNodeId: '87107b',
          name: 'Set File Name',
          type: 'SetVariable',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: 'f02966',
          parentNodeId: '87107b',
          dependsOn: [
            {
              activity: 'Set Folder Name',
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'Move Files to Archived',
          type: 'Copy',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: 'e1231c',
          parentNodeId: '87107b',
          dependsOn: [
            {
              activity: 'Move Files to Archived',
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'Delete Processed Files',
          type: 'Delete',
          isExpanded: false,
          expandable: false
        },
        {
          nodeId: 'fb4755',
          parentNodeId: '87107b',
          dependsOn: [
            {
              activity: 'Sellin Baseline Load Audit',
              dependencyConditions: 'Succeeded'
            }
          ],
          name: 'Set Folder Name',
          type: 'SetVariable',
          isExpanded: false,
          expandable: false
        }
      ]
    }
  }
};

export {
    mockData1
};
