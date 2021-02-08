import './MutationEditor.css';

import {useState} from 'react';

import axios from 'axios';

import {API, socket} from '../constants/env-constant';

const MutationDelete = (props) => {
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(1);
  const {conversationId, author, origin} = props;

  const handleMutation = async () => {
    const mutation = {
      author,
      conversationId,
      data: {index, length, text: '', type: 'delete'},
      origin,
    };
    await axios.post(API.POST_MUTATION, mutation);
    setIndex(0);
    setLength(1);
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
            <div className='label'>Len</div>
            <input
              placeholder='length'
              type='number'
              onKeyDown={(e) => e.preventDefault()}
              value={length}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value < 1) return;
                setLength(value);
              }}
            />
          </div>
        </div>
      </div>

      <button
        className='btn btn-danger btn-sm btn-block mt-2'
        onClick={handleMutation}>
        Delete
      </button>
    </div>
  );
};

export default MutationDelete;
