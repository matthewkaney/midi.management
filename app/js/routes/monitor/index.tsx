import React, { useState, useEffect, useCallback } from 'react';

import { receiveMIDI, receiveMidiInputs } from '@musedlab/midi/web';
// import { onHeldNotes } from '@musedlab/midi/messages';

import { MessageTypes } from '../../names/messageTypes';

// import { Piano } from '@musedlab/piano-ui';

import { MessageList } from '../../messages/MessageList';
import { LiveMessage } from '../../messages/LiveMessage';

import { Filters } from '../../filters';

import { useSlowState } from '../../useSlowState';
import { MidiMessage } from '@musedlab/midi/types-a762c7a3';

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

  // List of message objects
  let [messages, setMessages] = useSlowState<MidiMessage[][]>([[]]);

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

  // Currently held notes
  // let [currentNotes, setCurrentNotes] = useState([]);

  // useEffect(
  //   () =>
  //     receiveMIDI(
  //       onHeldNotes(n => {
  //         setCurrentNotes(n);
  //       })
  //     ),
  //   [setCurrentNotes]
  // );

  // TODO: Filter current notes by MIDI input filter

  // const keyClassFn = useCallback(
  //   key => (currentNotes.some(n => n.key === key) ? ['active'] : []),
  //   [currentNotes]
  // );

  return (
    <>
      <section className="monitor">
        <h1>Midi Monitor</h1>
        <button
          onClick={() => {
            setMessages([[]]);
          }}>
          Clear
        </button>
        <div className="monitor-scroll">
          {messages.map((list, i) => (
            <MessageList
              type={LiveMessage}
              messages={list}
              key={messages.length - i}
            />
          ))}
        </div>
        {/* <Piano keyClass={keyClassFn} /> */}
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
