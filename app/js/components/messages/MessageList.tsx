import { memo } from 'react';

const memoMessageList = memo(MessageList);
export { memoMessageList as MessageList };

function MessageList({ type, messages }) {
  let MessageType = type;
  return (
    <>
      {messages.map(m => (
        <MessageType message={m} key={m.id} />
      ))}
    </>
  );
}
