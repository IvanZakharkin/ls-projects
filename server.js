const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const wss = new WebSocket.Server({
    port: 8080
});

const USERS = new Map();
function authUser(ws) {
    ws.send(JSON.stringify({
        action: 'auth',
        payload: {
            users: [...USERS.values()],
            user: USERS.get(ws)
        }
    }));
}

function newMessage(payload) {
    for (const userWs of USERS.keys()) {
        userWs.send(JSON.stringify({
            action: 'message',
            payload: {...payload, dateUTC: new Date().getTime() }
        }));
    }
}

function newUser(ws) {
    const user = USERS.get(ws);

    for (const userWs of USERS.keys()) {
        if (ws !== userWs) {
            userWs.send(JSON.stringify({
                action: 'newUser',
                payload: { user }
            }));
        }
        
    }
}

function userLogout(ws) {
    const user = USERS.get(ws);

    for (const userWs of USERS.keys()) {
        if (ws !== userWs) {
            userWs.send(JSON.stringify({
                action: 'userLogout',
                payload: { user }
            }));
        }
    }
}

function updateUserAvatar(ws, payload) {
    const { avatar } = payload;
    const user = USERS.get(ws);
    
    user.avatar = avatar;

    for (const userWs of USERS.keys()) {
        userWs.send(JSON.stringify({
            action: 'updateUserAvatar',
            payload: { user }
        }));
    }
}

wss.on('connection', function connection(ws) {
    const id = uuidv4();

    ws.on('message', function incoming(message) {
        const { action, payload } = JSON.parse(message);

        switch(action) {
            case 'auth':
                USERS.set(ws, { id });
                USERS.get(ws).name = payload.user;
                USERS.get(ws).avatar = null;
                authUser(ws);
                newUser(ws);
                break;
            case 'message':
                newMessage(payload);
                break;
            case 'updateUserAvatar':
                updateUserAvatar(ws, payload);
                break;
        }

    });
    ws.on('close', function incoming(message) {
        userLogout(ws);
        USERS.delete(ws);
    });
});