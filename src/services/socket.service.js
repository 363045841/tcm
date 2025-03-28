import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(url) {
    if (!this.socket) {
      this.socket = io(url, { transports: ['websocket'] }); // 强制使用 WebSocket 协议
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new SocketService();