const { compile } =  require('handlebars');

async function compileMjml({ templateData }) {
    const compileTemplate = compile(templateData);
    return compileTemplate;
};


module.exports = compileMjml;
