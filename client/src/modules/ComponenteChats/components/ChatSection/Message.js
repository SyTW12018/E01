import React from 'react';

const Message = ({ chat, user }) => (
  <div className={`item ${user === chat.username ? 'right' : 'left'}`}>
      <div className="ui message">
    {user !== chat.username}
    {chat.content}
      </div>
  </div>
);

export default Message;
