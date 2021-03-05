export default class ClientWS {
    constructor(url) {
        this.ws = new WebSocket(url);
    }

    sendData(data) {
        this.ws.send(JSON.stringify(data));
    }

    addListenerOnMessage(fn) {
        this.ws.addEventListener('message', fn)
    } 
    addListenerOnOpen(fn) {
        this.ws.addEventListener('open', fn)
    } 
}