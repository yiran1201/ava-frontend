import './MutationEditor.css';

import {useEffect, useState} from 'react';

import axios from 'axios';

import {API, socket} from '../constants/env-constant';
import MutationInsert from './MutationInsert';
import MutationDelete from './MutationDelete';
import clsx from 'clsx';

const MutationEditor = (props) => {
  const [text, setText] = useState('');
  const [mutations, setMutations] = useState([]);
  const [origin, setOrigin] = useState({alice: 0, bob: 0});

  const {conversationId, author} = props;
  useEffect(() => {
    updateConversation();
  }, []);

  useEffect(() => {
    getConversation();
  }, [conversationId]);

  // fetch the current status of the conversation from server
  const getConversation = async () => {
    const res = await axios.get(`${API.GET_CONVERSATION}/${conversationId}`);
    const conversation = res.data;
    setText(conversation.text);
    setMutations(conversation.mutations);
    setOrigin(conversation.origin);
  };

  const updateConversation = () => {
    socket.on('updateConversation', (conversation) => {
      const {mutations, text, origin} = conversation;
      setText(text);
      setMutations(mutations);
      setOrigin(origin);
    });
  };

  const getMutationMessage = (mutation) => {
    const {author} = mutation;
    const {type, index, length, text} = mutation.data;
    const {alice, bob} = mutation.origin;

    return (
      <>
        <span className='text-primary text-uppercase mr-1'>{author[0]}</span>
        <span>{`(${bob}, ${alice})`}</span>
        <span
          className={clsx(
            'text-uppercase',
            'mx-1',
            type === 'insert' ? 'text-success' : 'text-danger'
          )}>
          {type.slice(0, 3)}
        </span>
        <span>{index}</span>
        <span>:</span>
        <span>{type === 'insert' ? `'${text}'` : length}</span>
      </>
    );
  };

  const Conversation = () => {
    return (
      <>
        <div className='mt-2'>
          <div className='label'>Text</div>
          <div className='text-primary'>{text}</div>
        </div>

        <div className='mt-2'>
          <div className='label'>Mutation History</div>
          {mutations.length > 0 &&
            mutations.map((mutation, i) => (
              <p
                key={`${mutation.author}-${i}`}
                className='border rounded p-1 mt-2 mb-0'
                style={{fontSize: '0.8rem'}}>
                {getMutationMessage(mutation)}
              </p>
            ))}

          {mutations.length === 0 && (
            <div>This conversation does not have any mutations</div>
          )}

          <div className='mt-2'>
            <div className='label'>Current State</div>
            <div className='d-flex align-items-center'>
              {['alice', 'bob'].map((name) => (
                <div
                  key={name}
                  className={clsx(
                    'd-flex flex-column align-items-center mr-3',
                    author === name ? 'text-success' : 'text-info'
                  )}>
                  <span className='text-capitalize'>{name}</span>
                  <span>{origin[name]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className='mt-2'>
            <div className='label'>Mutation Operation</div>
            <div className='text-primary' style={{fontSize: '0.75rem'}}>
              Tips: Use ▲ / ▼ for number input
            </div>
            <MutationInsert
              author={author}
              conversationId={conversationId}
              origin={origin}
            />
            <MutationDelete
              author={author}
              conversationId={conversationId}
              origin={origin}
            />
          </div>
        </div>
      </>
    );
  };

  return (
    <div>
      <div>
        <div className='label'>Conv ID</div>
        <div className='id-text'>{conversationId}</div>
      </div>

      {Conversation()}
    </div>
  );
};

export default MutationEditor;
