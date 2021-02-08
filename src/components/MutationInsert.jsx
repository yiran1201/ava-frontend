import './MutationEditor.css';

import {useState} from 'react';

import axios from 'axios';

import {API, socket} from '../constants/env-constant';

const MutationInsert = (props) => {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const {conversationId, author, origin} = props;

  const handleMutation = async () => {
    const mutation = {
      author,
      conversationId,
      data: {index, length: 0, text, type: 'insert'},
      origin,
    };
    await axios.post(API.POST_MUTATION, mutation);
    setIndex(0);
    setText('');
    socket.emit('syncConversationOnServer', conversationId);
  };

  return (
    <div>
      <div className='mt-2'>
        <div className='row'>
          <div className='col-4 d-flex flex-column'>
            <div className='label'>Index</div>
            <input
              placeholder='index'
              type='number'
              onKeyDown={(e) => e.preventDefault()}
              value={index}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value < 0) return;
                setIndex(value);
              }}
            />
          </div>

          <div className='col-8 d-flex flex-column'>
            <div className='label'>Text</div>
            <input
              placeholder='word'
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        </div>
      </div>

      <button
        className='btn btn-success btn-sm btn-block mt-2'
        onClick={handleMutation}
        disabled={text.trim().length === 0}>
        Insert
      </button>
    </div>
  );
};

export default MutationInsert;
