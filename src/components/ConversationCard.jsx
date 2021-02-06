import './ConversationCard.css';
import {AiFillStar, AiOutlineStar} from 'react-icons/ai';
import {BsTrashFill} from 'react-icons/bs';
import {useEffect, useState} from 'react';
import {socket} from '../constants/env-constant';
const ConversationCard = (props) => {
  const [text, setText] = useState('');
  const {index, conversation, liked} = props;
  const onConversation = () => {
    props.onConversation(conversation.id);
  };

  const likeConversation = () => {
    props.likeConversation(conversation.id);
  };

  const delConversation = () => {
    props.delConversation(conversation.id);
  };

  const updateConversation = () => {
    socket.on('updateConversation', (data) => {
      const {id, text} = data;
      if (id !== conversation.id) return;
      setText(text);
    });
  };

  useEffect(() => {
    updateConversation();
    setText(conversation.text);
  }, [conversation]);

  return (
    <div
      className='conversation-card p-2 rounded'
      style={{marginTop: index === 0 ? 0 : 15}}>
      <div className='text-muted index'>{`#${index + 1}`}</div>
      <div>
        <span className='card-title' onClick={onConversation}>
          {text}
        </span>
      </div>
      <div className='d-flex justify-content-end'>
        <span className='trash mr-1' onClick={delConversation}>
          <BsTrashFill size='1.2rem' />
        </span>
        <span className='star' onClick={likeConversation}>
          {liked ? (
            <AiFillStar size='1.2rem' />
          ) : (
            <AiOutlineStar size='1.2rem' />
          )}
        </span>
      </div>
    </div>
  );
};

export default ConversationCard;
