import React, { useState, useEffect, useCallback } from 'react';
import { render } from 'react-dom';

import { receiveMIDI, receiveMidiInputs } from '@musedlab/midi/web';
import { MessageTypes } from '../../names/messageTypes';

import { MessageList } from '../../messages/MessageList';
import { LiveMessage } from '../../messages/LiveMessage';

import { Filters } from '../../filters';

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
  let [messages, setMessages] = useState([[]]);

  let pushMessage = useCallback(
    message => {
      setMessages(list =>
        list[0].length < 100
          ? [[message, ...list[0]], ...list.slice(1)]
          : [[message], ...list]
      );
    },
    [setMessages]
  );

  useEffect(
    () =>
      receiveMIDI(m => {
        window.performance.mark('receive midi');
        let [status] = m.data;
        let type = status < 0xf0 ? status & 0xf0 : status;

        if (statusFilter[type] && midiFilter[m.input.id]) {
          // Format time label
          let formatter = new Intl.DateTimeFormat(undefined, {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
          });
          let date = new Date(performance.timeOrigin + m.time);
          let timeLabel = formatter
            .formatToParts(date)
            .map(part =>
              part.type === 'second'
                ? `${part.value}.${date
                    .getMilliseconds()
                    .toString()
                    .padStart(3, '0')}`
                : part.value
            )
            .join('');

          pushMessage({ ...m, timeLabel, id: id() });
        }
      }),
    [statusFilter, midiFilter, setMessages]
  );

  return (
    <div className="monitor-container">
      <section className="monitor">
        <div className="monitor-controls">
          <button
            onClick={() => {
              setMessages([[]]);
            }}>
            Clear
          </button>
        </div>
        <div className="monitor-scroll">
          {messages.map((list, i) => (
            <MessageList
              type={LiveMessage}
              messages={list}
              key={messages.length - i}
            />
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
    </div>
  );
}

window.onload = () => {
  render(<MidiMonitor />, document.getElementById('root'));
};
