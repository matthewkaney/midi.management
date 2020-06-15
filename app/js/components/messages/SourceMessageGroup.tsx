import React from 'react';

import { MessageList } from './MessageList';

export function SourceMessageGroup({ name, type, messages }) {
  return (
    <section className="source-group">
      <header>{name}</header>
      {messages.map((list, i) => (
        <MessageList type={type} messages={list} key={i} />
      ))}
    </section>
  );
}
