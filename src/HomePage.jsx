import './HomePage.css';

import {useEffect, useState} from 'react';

import {useHistory, useRouteMatch} from 'react-router-dom';

import ConversationCard from './components/ConversationCard';
import InfoPanel from './components/InfoPanel';
import {API, socket} from './constants/env-constant';
import axios from 'axios';
import MutationEditor from './components/MutationEditor';

const HomePage = () => {
  const [conversations, setConversations] = useState([]);
  const [conversationId, setConversationId] = useState('');
  const [likes, setLikes] = useState(new Set());
  const [author, setAuthor] = useState('');
  const match = useRouteMatch();
  const history = useHistory();

  const handleUrl = () => {
    let person = match.params.author;
    if (!['alice', 'bob'].includes(person)) {
      person = 'alice';
      history.push(`/${person}`);
    }
    setAuthor(person);
  };

  useEffect(() => {
    socket.emit('syncConversationsOnServer');
    getConversations();
    handleUrl();
  }, []);

  useEffect(() => {
    updateLikesOnConversationsSync();
  }, [conversations]);

  useEffect(() => {
    listenConversationDeletion();
  }, [conversationId]);

  const updateLikesOnConversationsSync = () => {
    const conversationIds = conversations.map(({id}) => id);
    const oldLikes = [...likes];
    const newLikes = new Set();
    for (const id of oldLikes) {
      if (conversationIds.includes(id)) newLikes.add(id);
    }
    setLikes(newLikes);
  };

  const getConversations = () => {
    socket.on('syncConversationsOnClient', (data) => {
      setConversations(data);
    });
  };

  const listenConversationDeletion = () => {
    socket.on('deleteConversationOnClient', (deletedId) => {
      if (deletedId === conversationId) setConversationId('');
    });
  };

  const onConversation = (conversationId) => {
    setConversationId(conversationId);
  };

  const likeConversation = (conversationId) => {
    const newLikes = new Set(likes);
    if (newLikes.has(conversationId)) {
      newLikes.delete(conversationId);
    } else {
      newLikes.add(conversationId);
    }
    setLikes(newLikes);
  };

  const delConversations = async () => {
    await axios.delete(API.DELETE_CONVERSATIONS);
    socket.emit('syncConversationsOnServer');
    setLikes(new Set());
    setConversationId('');
  };

  const resetConversations = async () => {
    await axios.get(API.RESET_CONVERSATIONS);
    socket.emit('syncConversationsOnServer');
    setLikes(new Set());
    setConversationId('');
  };

  const delConversation = async (id) => {
    await axios.delete(`${API.DELETE_CONVERSATION}/${id}`);
    socket.emit('syncConversationsOnServer');// update left panel
    socket.emit('deleteConversationOnServer', id);// update middle panel
  };

  return (
    <div className='vh-100 mx-auto d-flex justify-content-center'>
      <div className='row homepage'>
        <div className='col-12 col-sm-4 border-right p-3 panel'>
          {conversations.length === 0 && (
            <div className='text-danger text-center'>Conversation Empty</div>
          )}
          {conversations.map((conversation, i) => (
            <ConversationCard
              key={conversation.id}
              conversation={conversation}
              index={i}
              onConversation={onConversation}
              likeConversation={likeConversation}
              delConversation={delConversation}
              liked={likes.has(conversation.id)}
            />
          ))}
        </div>
        <div className='col-12 col-sm-5 p-3 panel'>
          {!!conversationId ? (
            <MutationEditor conversationId={conversationId} author={author} />
          ) : (
            <div className='text-info'>
              Please select a conversation to edit
            </div>
          )}
        </div>
        <div className='col-12 col-sm-3 border-left p-3 panel'>
          <InfoPanel
            author={author}
            stared={likes.size}
            total={conversations.length}
            delConversations={delConversations}
            resetConversations={resetConversations}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
