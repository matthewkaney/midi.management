import React, { useState, useEffect, useCallback } from 'react';
import { render } from 'react-dom';

import { receiveMIDI, receiveMidiInputs } from '@musedlab/midi/web';
import {
  onNoteOn,
  onNoteOff,
  onKeyPressure,
  onControlChange
} from '@musedlab/midi/message';
import * as Status from '@musedlab/midi/message/statuses';

import { Filters } from './filters';

let messageId = 0;

function id() {
  let currentId = messageId;
  messageId++;
  return currentId;
}

let defaultStatusFilter;

let savedStatusFilter = localStorage.getItem('type-filter');
if (savedStatusFilter) {
  defaultStatusFilter = JSON.parse(savedStatusFilter);
} else {
  defaultStatusFilter = {};

  for (let status of Object.values(Status)) {
    defaultStatusFilter[status] = true;
  }
}

function MidiMonitor() {
  // Filters for different message types
  let [statusFilter, setStatusFilter] = useState(defaultStatusFilter);

  useEffect(() => {
    localStorage.setItem('type-filter', JSON.stringify(statusFilter));
  }, [statusFilter]);

  // List of connected Midi Inputs and related filters
  let [midiInputs, setMidiInputs] = useState([]);
  let [midiFilter, setMidiFilter] = useState({});

  useEffect(() => {
    return receiveMidiInputs(inputs => {
      setMidiFilter(filter => {
        let newInputs = {};

        for (let input of inputs) {
          if (!(input.id in filter)) {
            newInputs[input.id] = true;
          }
        }

        return { ...newInputs, ...filter };
      });

      setMidiInputs(inputs);
    });
  }, [setMidiInputs, setMidiFilter]);

  // List of message objects
  let [messages, setMessages] = useState([]);

  let pushMessage = useCallback(
    message => {
      setMessages(list => [message, ...list]);
    },
    [setMessages]
  );

  useEffect(
    () =>
      receiveMIDI(rawMessage => {
        let status = rawMessage.data[0];
        let type = status < 0xf0 ? status & 0xf0 : status;

        if (statusFilter[type] && midiFilter[rawMessage.input.id]) {
          let time = new Date(
            performance.timeOrigin + rawMessage.time
          ).toLocaleTimeString();

          /*
        let data = [...rawMessage.data]
                .map(n => n.toString(16).padStart(2, '0'))
                .join(', ')
                .toUpperCase();
        */

          onNoteOn(({ channel, key, velocity }) => {
            pushMessage(
              <Message key={id()} time={time} name="Note On">
                <Info label="Channel">{channel}</Info>
                <Info label="Key">{key}</Info>
                <Info label="Velocity">
                  {velocity} ({Math.round((velocity / 127) * 100)}%)
                </Info>
              </Message>
            );
          })(rawMessage);

          onNoteOff(({ channel, key, velocity }) => {
            pushMessage(
              <Message key={id()} time={time} name="Note Off">
                <Info label="Channel">{channel}</Info>
                <Info label="Key">{key}</Info>
                <Info label="Velocity">
                  {velocity} ({Math.round((velocity / 127) * 100)}%)
                </Info>
              </Message>
            );
          })(rawMessage);

          onKeyPressure(({ channel, key, value }) => {
            pushMessage(
              <Message key={id()} time={time} name="Key Pressure">
                <Info label="Channel">{channel}</Info>
                <Info label="Key">{key}</Info>
                <Info label="Pressure">{value}</Info>
              </Message>
            );
          })(rawMessage);

          onControlChange(({ channel, controller, value }) => {
            pushMessage(
              <Message key={id()} time={time} name="Control Change">
                <Info label="Channel">{channel}</Info>
                <Info label="Controller">{controller}</Info>
                <Info label="Value">{value}</Info>
              </Message>
            );
          })(rawMessage);
        }
      }),
    [statusFilter, midiFilter, setMessages]
  );

  return (
    <>
      <section className="monitor">
        <h1>Midi Monitor</h1>
        <div className="monitor-scroll">{messages}</div>
      </section>
      <Filters
        midiFilter={midiFilter}
        setMidiFilter={setMidiFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        midiInputs={midiInputs}
      />
    </>
  );
}

function Message({ time, name, children }) {
  return (
    <article>
      <header>
        <time>{time}</time>
        <h2>{name}</h2>
      </header>
      {children}
    </article>
  );
}

function Info({ label, children }) {
  return (
    <div>
      <h3>{label}:&nbsp;</h3>
      {children}
    </div>
  );
}

window.onload = () => {
  render(<MidiMonitor />, document.getElementById('root'));
};
