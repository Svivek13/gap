const { get: _get, map: _map, isEmpty: _isEmpty, isFinite: _isFinite } = require('lodash');
const { cleanEntityData } = require('../helpers/commonUtils');

const mapBUBankResponse = ({ data }) => {
    const AdoptionRate_Vs_PreviousCampaign = _get(data, 'metrics.AdoptionRate_Vs_PreviousCampaign');
    const displaySequence_AdoptionRate_Vs_PreviousCampaign = ["First Contact", "Success", "Failure", "Other"];
    let new_AdoptionRate_Vs_PreviousCampaign = [];
    displaySequence_AdoptionRate_Vs_PreviousCampaign.forEach(ds => {
        let found = AdoptionRate_Vs_PreviousCampaign.find(item => item.displaytext === ds)
        if (found) {
            new_AdoptionRate_Vs_PreviousCampaign.push(found);
        }
        
    })

    const AdoptionRate_Vs_CurrentEngagement = _get(data, 'metrics.AdoptionRate_Vs_CurrentEngagement');
    const displaySequence_AdoptionRate_Vs_CurrentEngagement = ["No Loan Customer", "Only Housing Loan", "Only Personal Loan", "Housing+Personal loan"]
    let new_AdoptionRate_Vs_CurrentEngagement = [];
    displaySequence_AdoptionRate_Vs_CurrentEngagement.forEach(ds => {
        let found = AdoptionRate_Vs_CurrentEngagement.find(item => item.displaytext === ds)
        if (found) {
            new_AdoptionRate_Vs_CurrentEngagement.push(found);
        }
        
    })

    const Adoptions_Vs_Days = _get(data, 'metrics.Adoptions_Vs_Days');
    const displaySequence_Adoptions_Vs_Days = ["Current Campaign", "<30 Days", "30 to 90 Days", "90 to 180 days", "180 to 360 days", "360 to 720 days",  ">720 days"]
    let new_Adoptions_Vs_Days = [];
    displaySequence_Adoptions_Vs_Days.forEach(ds => {
        let found = Adoptions_Vs_Days.find(item => item.displaytext === ds)
        if (found) {
            new_Adoptions_Vs_Days.push(found);
        }
        
    })

    const Adoptions_Vs_Contacts = _get(data, 'metrics.Adoptions_Vs_Contacts');
    const displaySequence_Adoptions_Vs_Contacts = ["1 to 2", "3 to 5", "6 to 10", "11 to 20", ">20"];
    let new_Adoptions_Vs_Contacts = [];
    displaySequence_Adoptions_Vs_Contacts.forEach(ds => {
        let found = Adoptions_Vs_Contacts.find(item => item.displaytext === ds)
        if (found) {
            new_Adoptions_Vs_Contacts.push(found);
        }
        
    })

    return {
        template: _get(data, 'template'),
        metrics: {
            TD_Adoption_Rate: _get(data, 'metrics.TD_Adoption_Rate'),
            Adoptions_Vs_Days: new_Adoptions_Vs_Days,
            Adoptions_Vs_Contacts: new_Adoptions_Vs_Contacts,
            AdoptionRate_Vs_CurrentEngagement: new_AdoptionRate_Vs_CurrentEngagement,
            AdoptionRate_Vs_PreviousCampaign: new_AdoptionRate_Vs_PreviousCampaign
        }
    }
};
const mapBUTelcoResponse = ({ data }) => {
    const Churners_By_ProductMix = _get(data, 'metrics.Churners_By_ProductMix');
    const displaySequence_Churners_By_ProductMix = ["Data Only", "Voice Only", "Video Only", "Voice + Data", "Data + Video", "Voice + Video", "Triple Play", "Only Add-on"];
    let new_Churners_By_ProductMix = [];
    displaySequence_Churners_By_ProductMix.forEach(ds => {
        let found = Churners_By_ProductMix.find(item => item.displaytext === ds)
        if (found) {
            new_Churners_By_ProductMix.push(found);
        }
        
    })
    
    const Tenure_Vs_Average = _get(data, 'metrics.Tenure_Vs_Average');
    const displaySequence_Tenure_Vs_Average = ["0 to 6 months", "6 to 12 months", "12 to 24 months", "24 to 36 months", "36 to 48 months", "48 to 60 months",  "More than 60 months "];
    let new_Tenure_Vs_Average = [];
    displaySequence_Tenure_Vs_Average.forEach(ds => {
        let found = Tenure_Vs_Average.find(item => item.displaytext === ds)
        if (found) {
            new_Tenure_Vs_Average.push(found);
        }
        
    })

    let metrics = _get(data, 'metrics');
    metrics = {
        ...metrics,
        Churners_By_ProductMix: new_Churners_By_ProductMix,
        Tenure_Vs_Average: new_Tenure_Vs_Average
    }

    return {
        template: _get(data, 'template'),
        metrics
    }
};

const mapBURossmannRes = ({ data }) => {
    const response = cleanEntityData({
        template: _get(data, 'template'),
        metrics: cleanEntityData({
            sales_per_store: _get(data, 'metrics.Sales_Per_Store'),
            customers_per_store: _get(data, 'metrics.Customers_Per_Store'),
            sales_by_store: _map(_get(data, 'metrics.Sales_By_Store'), d => cleanEntityData({
                displayText: _get(d, 'displaytext'),
                value: _get(d, 'sales'),
                storeCount: _get(d, 'value')
            })),
            customers_by_store: _map(_get(data, 'metrics.Customers_By_Store'), d => cleanEntityData({
                displayText: _get(d, 'displaytext'),
                value: _get(d, 'customers'),
                storeCount: _get(d, 'value')
            })),
            holiday_sales: _get(data, 'metrics.Holiday_Sales'),
            non_holiday_sales: _get(data, 'metrics.Non_Holiday_Sales'),
        }),
        _id: _get(data, '_id'),
        projectId: _get(data, 'projectId'),
        execId: _get(data, 'execId'),

    });
    return response;
}

module.exports = {
    mapBUBankResponse,
    mapBUTelcoResponse,
    mapBURossmannRes,
}
