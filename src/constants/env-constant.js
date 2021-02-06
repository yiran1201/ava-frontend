import io from 'socket.io-client';

const IN_PROD = process.env.NODE_ENV === 'production';
const origin = IN_PROD ? '' : 'http://localhost:5000';
const socket = io(origin);

const API = {
  DELETE_CONVERSATIONS: `${origin}/conversations`,
  ADD_CONVERSATION: `${origin}/conversation`,
  GET_CONVERSATION: `${origin}/conversation`,
  DELETE_CONVERSATION: `${origin}/conversation`,
  POST_MUTATION: `${origin}/mutations`,
  RESET_CONVERSATIONS: `${origin}/reset-conversations`,
};

export {socket, API};
