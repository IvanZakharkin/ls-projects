import { renderTemplate } from './utils';

export default class UsersList {
    constructor(users) {
        this.users = users;
    }

    getTemplate() {
        return renderTemplate('usersListTemplate', { users: this.users });
    }

    render() {
        const container = document.querySelector('#usersList');
        const template = this.getTemplate();

        container.innerHTML = template;
    }

    addUser(user) {
        this.users.push(user);
        // this.render();
    }

    deleteUser(user) {
        this.users = this.users.filter((u) => u.id !== user.id);
        // this.render();
    }
}