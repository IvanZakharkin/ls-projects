import { renderTemplate } from './utils';

export default class User {
    constructor(handlerSubmitForm) {
        this.handlerSubmitForm = handlerSubmitForm;
    }

    getTemplate() {
        return renderTemplate('authTemplate');
    }

    render() {
        const container = document.querySelector('#app');
        const template = this.getTemplate();

        container.innerHTML = template;

        const form = document.querySelector('#auth');
        console.log(form, this.handlerSubmitForm);
        form.addEventListener('submit', this.handlerSubmitForm);
    }
}
