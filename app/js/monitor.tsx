import React, { useState, useEffect, useCallback } from 'react';
import { render } from 'react-dom';

import { receiveMIDI, receiveMidiInputs } from '@musedlab/midi/web';
import { MessageTypes } from './names/messageTypes';

import { LiveMessage } from './messages/LiveMessage';

import { Filters } from './filters';

let messageId = 0;

export function id() {
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

  for (let status in MessageTypes) {
    defaultStatusFilter[status] = true;
  }
}

export function MidiMonitor(props) {
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
      receiveMIDI(m => {
        let [status] = m.data;
        let type = status < 0xf0 ? status & 0xf0 : status;

        if (statusFilter[type] && midiFilter[m.input.id]) {
          let timeLabel = new Date(
            performance.timeOrigin + m.time
          ).toLocaleTimeString();

          pushMessage({ ...m, timeLabel });
        }
      }),
    [statusFilter, midiFilter, setMessages]
  );

  return (
    <>
      <section className="monitor">
        <h1>Midi Monitor</h1>
        <div className="monitor-scroll">
          {messages.map(m => (
            <LiveMessage message={m} key={id()} />
          ))}
        </div>
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

window.onload = () => {
  render(<MidiMonitor />, document.getElementById('root'));
};
