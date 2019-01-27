import React from 'react';
import styles from './ChatSection.css';

const Message = ({ chat, user }) => (
  <div class={styles.ui}>
    <br/>
    <p> {chat.username} </p>
    <div className="ui message">
        {chat.content}
    </div>
  </div>
);

export default Message;
