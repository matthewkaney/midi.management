import React from 'react';

import { fromDataBytes } from '@musedlab/midi/data';
import {
  getChannel,
  isNoteOn,
  isNoteOff,
  isKeyPressure,
  isControlChange,
  isProgramChange,
  isPitchBend,
  isChannelPressure
} from '@musedlab/midi/messages';

import { getMidiNoteName } from '../names/pitches';

import { Message, Info } from './Message';

export function ChannelMessage({ message }) {
  let ChannelInfo = <Info label="Channel">{getChannel(message) + 1}</Info>;
  let key: number, velocity: number, pressure: number;

  if (isNoteOn(message)) {
    [, key, velocity] = message.data;
    return (
      <Message message={message} name="Note On">
        {ChannelInfo}
        <Info label="Key">
          {key} ({getMidiNoteName(key)})
        </Info>
        <Info label="Velocity">
          {velocity} ({Math.round((velocity / 127) * 100)}%)
        </Info>
      </Message>
    );
  } else if (isNoteOff(message)) {
    [, key, velocity] = message.data;
    return (
      <Message message={message} name="Note Off">
        {ChannelInfo}
        <Info label="Key">
          {key} ({getMidiNoteName(key)})
        </Info>
        <Info label="Velocity">
          {velocity} ({Math.round((velocity / 127) * 100)}%)
        </Info>
      </Message>
    );
  } else if (isKeyPressure(message)) {
    [, key, pressure] = message.data;
    return (
      <Message message={message} name="Key Pressure">
        {ChannelInfo}
        <Info label="Key">
          {key} ({getMidiNoteName(key)})
        </Info>
        <Info label="Pressure">
          {pressure} ({Math.round((pressure / 127) * 100)}%)
        </Info>
      </Message>
    );
  } else if (isChannelPressure(message)) {
    let [, pressure] = message.data;
    return (
      <Message message={message} name="Channel Pressure">
        {ChannelInfo}
        <Info label="Pressure">
          {pressure} ({Math.round((pressure / 127) * 100)}%)
        </Info>
      </Message>
    );
  } else if (isPitchBend(message)) {
    let [, lsb, msb] = message.data;
    let bend = fromDataBytes([msb, lsb]);
    let bendPercent = Math.round((bend / 8192 - 1) * 100);
    return (
      <Message message={message} name="Pitch Bend">
        {ChannelInfo}
        <Info label="Pitch Bend">
          {bend} ({Math.sign(bendPercent) === 1 ? '+' : ''}
          {bendPercent}%)
        </Info>
      </Message>
    );
  } else if (isControlChange(message)) {
    let [, controller, value] = message.data;
    return (
      <Message message={message} name="Control Change">
        {ChannelInfo}
        <Info label="Controller">{controller}</Info>
        <Info label="Value">{value}</Info>
      </Message>
    );
  } else if (isProgramChange(message)) {
    let [, program] = message.data;
    return (
      <Message message={message} name="Program Change">
        {ChannelInfo}
        <Info label="Program">{program}</Info>
      </Message>
    );
  }
}
