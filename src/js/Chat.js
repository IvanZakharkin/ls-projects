import { renderTemplate } from './utils';

export default class Chat {
    constructor(user, usersList, messanger) {
        this._user = user;
        this._usersList = usersList;
        this._messanger = messanger;
    }

    getTemplate() {
        return renderTemplate('chatTemplate')
    }

    render() {
        const container = document.querySelector('#app');
        const template = this.getTemplate();

        container.innerHTML = template;

        this.renderUser();
        this.renderUsersList();
        this.renderMessanger();
    }

    renderUser() {
        this._user.render();
    }

    renderUsersList() {
        this._usersList.render();
    }

    renderMessanger() {
        this._messanger.render();
    }

    addUser(user) {
        this._usersList.addUser(user);
        this.renderUsersList();
        this._messanger.addSystemMessage('userOn', user.name)
    }

    deleteUser(user) {
        this._usersList.deleteUser(user);
        this.renderUsersList();
        this._messanger.addSystemMessage('userOff', user.name)
    }

    addMessage(data) {
        this._messanger.addMessage('message', data);
    }

    updateUserAvatar(user) {
        if (user.id === this._user.getId()) {
            this._user.updateAvatar(user.avatar);
        }
        
        this._messanger.updateUserAvatarOnMessages(user);
    }
}