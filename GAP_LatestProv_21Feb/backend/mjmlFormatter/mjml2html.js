const mjml2html = require('mjml');

async function convertMjmlToHtml({ content }) {
    const { html: htmlData } = mjml2html(content);
    return htmlData;
}

module.exports = convertMjmlToHtml;
