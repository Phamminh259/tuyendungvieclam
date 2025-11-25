import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.connected = false;
    this.subscriptions = new Map();
    this.connectPromise = null;
    this.connectionTimeout = 10000; // 10 seconds timeout
  }

  async connect() {
    if (this.connectPromise) {
      return this.connectPromise;
    }

    this.connectPromise = new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Connection timeout'));
        this.connectPromise = null;
      }, this.connectionTimeout);

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
          console.log('WebSocket connected successfully');
          this.connected = true;
          clearTimeout(timeoutId);
          resolve(this.stompClient);
        };

        this.stompClient.onDisconnect = () => {
          console.log('WebSocket disconnected');
          this.connected = false;
        };

        this.stompClient.onStompError = (frame) => {
          console.error('STOMP error:', frame);
          clearTimeout(timeoutId);
          reject(frame);
        };

        this.stompClient.activate();
      } catch (error) {
        clearTimeout(timeoutId);
        console.error('Error activating STOMP client:', error);
        this.connectPromise = null;
        reject(error);
      }
    });

    return this.connectPromise;
  }

  async subscribe(destination, callback, retryCount = 3) {
    for (let i = 0; i < retryCount; i++) {
      try {
        const client = await this.connect();
        
        // Wait for connection to be fully established
        if (!client.connected) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          if (!client.connected) {
            throw new Error('Client not connected after waiting');
          }
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
        console.error(`Subscription attempt ${i + 1} failed:`, error);
        if (i === retryCount - 1) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s before retry
      }
    }
  }

  async sendMessage(destination, message) {
    try {
      const client = await this.connect();

      if (!client.connected) {
        throw new Error('Client not connected');
      }

      const messageToSend = typeof message === 'string' ? message : JSON.stringify(message);
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

  disconnect() {
    try {
      if (this.stompClient?.connected) {
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
  }

  cleanup = () => {
    this.stompClient = null;
    this.connected = false;
    this.subscriptions.clear();
    this.connectPromise = null;
  };

  isConnected = () => {
    return this.stompClient?.connected || false;
  };
}

export default new WebSocketService(); 