import { reactive, onBeforeUnmount } from 'vue';
import { io } from 'socket.io-client';

export default function useSocket(port = 5555, host = 'localhost') {
  const socket = io(`ws://${host}:${port}/`, {
    autoConnect: false,
  });

  const state = reactive({
    connected: false,
    error: false,
  });

  socket.on('connect', () => {
    state.connected = true;
    state.error = false;
  });
  socket.on('disconnect', () => {
    state.connected = false;
  });
  socket.on('connect_error', () => {
    state.connected = false;
    state.error = true;
  });

  function on<T>(event: string, callback: (data: T) => void) {
    socket.on(event, callback);
  }

  function connect() {
    socket.connect();
  }

  function disconnect() {
    socket.disconnect();
  }

  onBeforeUnmount(() => {
    socket.disconnect();
  });

  return {
    state,
    on,
    connect,
    disconnect,
  };
}
