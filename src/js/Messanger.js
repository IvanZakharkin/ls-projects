import { renderTemplate } from './utils';

export default class Messanger {
    constructor(handlerSendMessage, user) {
        this.handlerSendMessage = handlerSendMessage;
        this.user = user;
    }

    getTemplate() {
        return renderTemplate('messangerTemplate');
    }

    render() {
        const container = document.querySelector('#messages');
        const template = this.getTemplate();

        container.innerHTML = template;
        this.addHandlerSendMessage();
    }

    addHandlerSendMessage() {
        const form = document.querySelector('[data-role="sendMessage"]');

        form.addEventListener('submit', this.handlerSendMessage);
    }
    addMessage(type, data) {
        if (type === 'message') {
            this.addUserMessage(data);
        } else {
            this.addSystemMessage(type, data)
        }
    }

    addUserMessage(data) {
        const { message, user,  dateUTC } = data;
        const isCurrentUserMmessage = user.id === this.user;
        const classMessage = isCurrentUserMmessage ? 'alert-danger' : 'alert-primary';
        const d = new Date(dateUTC);
        const formatDate = `${d.getHours()}:${d.getMinutes()} ${d.getDate()}.${d.getMonth()}.${d.getFullYear()}`;
        console.log();
        const avatar = user.avatar ? `<img src="${user.avatar}">` : ''
        const template =`
        <li class="chat__message media w-75 alert mb-3" data-user-id="${user.id}">
            <div class="rounded-circle overflow-hidden mr-3 bg-secondary avatar" style="width: 50px; height: 50px">${avatar}
            </div>
            <div class="media-body">
                <p class="mb-1 small text-muted">
                    <span class="font-weight-bold">${user.name}</span>
                    <span>${formatDate}<span>
                </p>
                <h5 class="">${message}</h5>
            </div>
        </li>`;

        this.appendMessage(template);
    }

    appendMessage(template) {
        const messages = document.querySelector('[data-role="messagesList"]');
        const div = document.createElement('div');

        div.innerHTML = template;
        const message = div.firstElementChild;

        messages.append(message);
    }

    addSystemMessage(type, name) {
        let text = '';
        switch(type) {
            case 'userOn':
                text += `${name} вошел в чат`;
                break;
            case 'userOff':
                text += `${name} вышел из чата`;
                break;
            default: 
                throw new Error(`Указан неверный тип сообщения: ${type}`)
        }

        const template = `
            <li class="chat__message chat__message_system alert alert-dark text-center p-1 mb-3">
                <div class="chat__message-text">${text}</div>
            </li>`
        
        this.appendMessage(template);
    }

    updateUserAvatarOnMessages(user) {
        const messagesAvatars = document.querySelectorAll(`.chat__message[data-user-id="${user.id}"]`);
        console.log(messagesAvatars);
        for (let i = 0, length = messagesAvatars.length; i < length; i++) {
            console.log(avatar);
            const avatar = messagesAvatars[i].querySelector('.avatar');
            const img = document.createElement('img');
            img.setAttribute('src', user.avatar);
            avatar.innerHTML = '';
            avatar.append(img);
        }
        
    }
}
