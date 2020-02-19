import React, { useState, useEffect, useCallback } from 'react';
import { produce } from 'immer';

import { receiveMIDI, receiveMidiInputs } from '@musedlab/midi/web';

import { MessageTypes } from '../../names/messageTypes';

import { SourceMessageGroup } from '../../components/messages/SourceMessageGroup';
import { LiveMessage } from '../../components/messages/LiveMessage';

import { Filters } from '../../filters';

import { useSlowState } from '../../useSlowState';
import { MidiMessage } from '@musedlab/midi/types-a762c7a3';

import { AutoScrollPane } from '../../components/AutoScrollPane';

let messageId = 0;

export function id() {
  let currentId = messageId;
  messageId++;
  return currentId;
}

let defaultStatusFilter: { [type: number]: boolean };

let savedStatusFilter = localStorage.getItem('type-filter');
if (savedStatusFilter) {
  defaultStatusFilter = JSON.parse(savedStatusFilter);
} else {
  defaultStatusFilter = {};

  for (let status in MessageTypes) {
    defaultStatusFilter[status] = true;
  }
}

export function MidiMonitor() {
  // Filters for different message types
  let [statusFilter, setStatusFilter] = useState(defaultStatusFilter);

  useEffect(() => {
    localStorage.setItem('type-filter', JSON.stringify(statusFilter));
  }, [statusFilter]);

  // List of connected Midi Inputs and related filters
  let [midiInputs, setMidiInputs] = useState<MIDIInput[]>([]);
  let [midiFilter, setMidiFilter] = useState({});

  useEffect(() => {
    return receiveMidiInputs(inputs => {
      setMidiFilter(filter => {
        let newInputs: { [id: string]: boolean } = {};

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

  interface InputMessageList {
    id: string;
    name?: string;
    manufacturer?: string;
    messages: MidiMessage[][];
  }

  // List of message objects
  let [messages, setMessages] = useSlowState<InputMessageList[]>([]);

  let pushMessage = useCallback(
    message => {
      setMessages(
        produce((inputs: InputMessageList[]) => {
          if (
            inputs.length > 0 &&
            inputs[inputs.length - 1].id === message.input.id
          ) {
            let input = inputs[inputs.length - 1];
            let messageGroup = input.messages[input.messages.length - 1];

            if (messageGroup.length < 100) {
              messageGroup.push(message);
            } else {
              input.messages.push([message]);
            }
          } else {
            let { id, name, manufacturer } = message.input;
            inputs.push({ id, name, manufacturer, messages: [[message]] });
          }
        })
      );
    },
    [setMessages]
  );

  useEffect(
    () =>
      receiveMIDI(m => {
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
    <>
      <section className="monitor">
        <h1>Midi Monitor</h1>
        <button
          onClick={() => {
            setMessages([]);
          }}>
          Clear
        </button>
        <AutoScrollPane>
          {messages.map(({ name, messages }, i) => (
            <SourceMessageGroup
              name={name}
              type={LiveMessage}
              messages={messages}
              key={i}
            />
          ))}
        </AutoScrollPane>
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
