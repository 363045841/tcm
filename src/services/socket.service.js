import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(url) {
    if (!this.socket) {
      // 强制使用 WebSocket 协议
      this.socket = io(url, {
        transports: ['websocket'],
        path: '/socket.io', // 路径可以根据你的后端配置来调整
        autoConnect: false, // 不自动连接
      });

      // 连接 WebSocket
      this.socket.connect(); 
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
