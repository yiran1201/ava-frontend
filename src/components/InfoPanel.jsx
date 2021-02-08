import axios from 'axios';
import {useState} from 'react';
import {API, socket} from '../constants/env-constant';
import './InfoPanel.css';

const InfoPanel = (props) => {
  const [text, setText] = useState('');
  const {author, stared, total} = props;
  const addConversation = async () => {
    await axios.post(API.ADD_CONVERSATION, {text: text.trim()});
    setText('');
    socket.emit('syncConversationsOnServer');
  };

  return (
    <div className='info-panel d-flex flex-column'>
      <div className='text-success d-flex align-items-center'>
        <div className='dot mr-2 bg-success'></div>
        <span className='author'>{author}</span>
      </div>

      <div className='mt-2'>
        <div className='label'>Stared Convs</div>
        <div className='text-warning'>{stared}</div>
      </div>

      <div className='mt-2'>
        <div className='label'>Total Convs</div>
        <div className='text-info'>{total}</div>
      </div>

      <div className='mt-auto' />
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      <button
        className='btn btn-success btn-sm btn-block mt-2'
        onClick={addConversation}
        disabled={text.length === 0}>
        Add Conv
      </button>
      <button
        className='btn btn-info btn-sm btn-block mt-2'
        onClick={props.resetConversations}>
        Reset Convs
      </button>
      <button
        className='btn btn-danger btn-sm btn-block mt-2'
        onClick={props.delConversations}>
        Del Convs
      </button>
    </div>
  );
};

export default InfoPanel;
