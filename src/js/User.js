import { renderTemplate } from './utils';

export default class User {
    constructor(user, handlerDropAvatar) {
        this.user = user;
        this.handlerDropAvatar = handlerDropAvatar;
    }

    name() {
        return user.name;
    }

    getTemplate() {
        return renderTemplate('userTemplate', this.user);
    }

    getData() {
        return this.user;
    }

    getId() {
        return this.user.id;
    }

    updateAvatar(avatar) {
        this.user.avatar = avatar;
        this.render();
    }

    render() {
        const container = document.querySelector('#user');
        const template = this.getTemplate();

        container.innerHTML = template;

        const avatar = document.querySelector('#avatar');

        avatar.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.stopPropagation();
        })

        avatar.addEventListener('dragenter', function(e) {
            e.target.style.background = 'red';
        })

        avatar.addEventListener('dragleave', function(e) {
            e.target.style.background = '#6c757d';
        })

        avatar.addEventListener('drop', this.handlerDropAvatar);
    }
}
