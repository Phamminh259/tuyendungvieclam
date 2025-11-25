import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketChatbotService {
  constructor() {
    this.stompClient = null;
    this.connected = false;
    this.subscriptions = new Map();
    this.connectPromise = null;
  }

  async connect() {
    if (this.connectPromise) {
      return this.connectPromise;
    }

    this.connectPromise = new Promise((resolve, reject) => {
      try {
        const socket = new SockJS(`http://localhost:8080/ws`);
        this.stompClient = new Client({
          webSocketFactory: () => socket,
          debug: function (str) {
            console.log('STOMP: ' + str);
          },
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000
        });

        this.stompClient.onConnect = () => {
          console.log('Chatbot WebSocket connected successfully');
          this.connected = true;
          resolve(this.stompClient);
        };

        this.stompClient.onDisconnect = () => {
          console.log('Chatbot WebSocket disconnected');
          this.connected = false;
        };

        this.stompClient.onStompError = (frame) => {
          console.error('STOMP error:', frame);
          reject(frame);
        };

        this.stompClient.activate();
      } catch (error) {
        console.error('Error activating STOMP client:', error);
        this.connectPromise = null;
        reject(error);
      }
    });

    return this.connectPromise;
  }

  cleanup = () => {
    this.stompClient = null;
    this.connected = false;
    this.subscriptions.clear();
    this.connectPromise = null;
  };

  subscribe = async (destination, callback) => {
    try {
      // Đảm bảo đã kết nối trước khi subscribe
      const client = await this.connect();

      // Kiểm tra lại kết nối sau khi đợi
      if (!client.connected) {
        throw new Error('Client not connected after connect()');
      }

      console.log('Subscribing to:', destination);
      const subscription = client.subscribe(destination, (message) => {
        try {
          if (message && typeof callback === 'function') {
            callback(message);
          }
        } catch (error) {
          console.error('Error in subscription callback:', error);
        }
      });

      this.subscriptions.set(destination, subscription);
      return subscription;
    } catch (error) {
      console.error('Error subscribing:', error);
      throw error;
    }
  };

  async sendMessage(destination, message) {
    try {
      const client = await this.connect();

      if (!client.connected) {
        throw new Error('Client not connected');
      }

      const messageToSend = typeof message === 'string' ? message : JSON.stringify(message);
      
      // Sử dụng publish thay vì send
      client.publish({
        destination: destination,
        body: messageToSend,
        headers: { 'content-type': 'application/json' }
      });

    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  disconnect = () => {
    try {
      if (this.stompClient?.active) {
        // Hủy tất cả subscriptions
        this.subscriptions.forEach(subscription => {
          try {
            subscription.unsubscribe();
          } catch (e) {
            console.error('Error unsubscribing:', e);
          }
        });

        this.stompClient.deactivate();
        this.cleanup();
      } else {
        this.cleanup();
      }
    } catch (error) {
      console.error('Error during disconnect:', error);
      this.cleanup();
    }
  };

  isConnected = () => {
    return this.stompClient?.connected || false;
  };
}

export default new WebSocketChatbotService(); 