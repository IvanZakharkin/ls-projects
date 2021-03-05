import './styles/base.scss'

import Chat from './js/Chat';
import ClientWS from './js/ClientWS';
import Messanger from './js/Messanger';
import User from './js/User';
import UsersList from './js/UsersList';
import AuthForm from './js/AuthForm';

const handlerSendMessage = (e) => {
  e.preventDefault();
  const inputMessage = e.target.elements.message;
  const message = inputMessage.value;

  wsClient.sendData({
    action: 'message',
    payload: {
      message: message,
      user: currentUser.getData(),
      dateUTC: new Date().getTime()
    }
  });

  inputMessage.value = '';
}

function handlerDropAvatar(e) {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  
  reader.onload = function() {
    wsClient.sendData({
      action: 'updateUserAvatar',
      payload: {
        user: currentUser.getData(),
        avatar: reader.result
      }
    });
  };
}

function handlerSubmitAuthForm(e) {
  e.preventDefault();

  const data = {
    action: 'auth',
    payload: {
      user: e.target.elements.name.value
    }
  };

  wsClient.sendData(data);
}

const wsClient = new ClientWS('ws://localhost:8080/');
const authForm = new AuthForm(handlerSubmitAuthForm);
let currentUser;
let chat;
let usersList;
let messanger;

wsClient.addListenerOnOpen(() => {
  authForm.render();
});

wsClient.addListenerOnMessage((response) => {
  const { action, payload } = JSON.parse(response.data);

  switch(action) {
    case 'auth':
      const { user, users } = payload;
      currentUser = new User(user, handlerDropAvatar);
      usersList = new UsersList(users);
      messanger = new Messanger(handlerSendMessage, currentUser);
      chat = new Chat(currentUser, usersList, messanger);
      chat.render();
      break;
    case 'message':
      chat.addMessage(payload);
      break;
    case 'newUser':
      chat.addUser(payload.user);
      break;
    case 'userLogout':
      chat.deleteUser(payload.user);
      break;
    case 'updateUserAvatar':
      console.log(payload);
      chat.updateUserAvatar(payload.user);
      break;
  }
})

