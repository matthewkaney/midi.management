import React from 'react';
import { MidiMessage } from '@musedlab/midi/types-a762c7a3';

export function UnknownMessage({ message }) {
  return (
    <Message name="Unrecognized Message" message={message}>
      <Info label="Data">
        <Hex data={message.data} />
      </Info>
    </Message>
  );
}

type MessageProps = {
  message: MidiMessage & { timeLabel: string; sourceLabel: string };
  name: string;
  children?: React.ReactNode;
};

export function Message({ message, name, children = undefined }: MessageProps) {
  return (
    <article className="midi-message">
      <header>
        <time>{message.timeLabel}</time>
        <h2>{name}</h2>
        <div className="source">{message.sourceLabel}</div>
      </header>
      <div className="message-info">{children}</div>
    </article>
  );
}

export function Hex({ data }) {
  return (
    <>
      {[...data]
        .map(n => n.toString(16).padStart(2, '0'))
        .join(' ')
        .toUpperCase()}
    </>
  );
}

export function Info({ label, children }) {
  return (
    <div>
      <h3>{label}:&nbsp;</h3>
      {children}
    </div>
  );
}
