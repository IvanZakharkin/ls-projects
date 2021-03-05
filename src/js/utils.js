export const renderTemplate = function(templateId, data = {}) {
    if (!templateId) {
        throw new Error('template is undefined');
    }
    
    const templateElement = document.getElementById(templateId);
    const templateSource = templateElement.innerHTML;
    const renderFn = Handlebars.compile(templateSource);

    return renderFn(data);
}
