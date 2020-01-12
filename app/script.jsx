import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';

import { receiveMIDI, receiveMidiInputs } from '@musedlab/midi/web';
import { parseMidiMessage } from '@musedlab/midi/message';
import * as Status from '@musedlab/midi/message/statuses';
import { Names } from './messageNames';

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

  let [messages, setMessages] = useState([]);

  useEffect(() => {
    return receiveMIDI(rawMessage => {
      let status = rawMessage.data[0];
      let type = status < Status.SYSTEM_EXCLUSIVE ? status & 0xf0 : status;

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

        let message = (
          <Message time={time} name={Names[type]} key={id()}></Message>
        );

        setMessages(m => [message, ...m].slice(0, 200));
      }
    });
  }, [statusFilter, midiFilter, setMessages]);

  return (
    <>
      <section className="monitor">
        <h1>Midi Monitor</h1>
        <div className="monitor-scroll">{messages}</div>
      </section>
      <aside className="filters">
        <h2>Filter Messages</h2>
        <h3>MIDI Input</h3>
        <FilterList filter={midiFilter} changeFilter={setMidiFilter}>
          {midiInputs.map(({ id, name, manufacturer }) => (
            <Filter id={id}>
              {manufacturer} {name}
            </Filter>
          ))}
        </FilterList>
        <h3>Message Type</h3>
        <FilterList filter={statusFilter} changeFilter={setStatusFilter}>
          <StatusFilter id={Status.NOTE_OFF} />
          <StatusFilter id={Status.NOTE_ON} />
          <StatusFilter id={Status.KEY_PRESSURE} />
          <StatusFilter id={Status.CONTROL_CHANGE} />
          <StatusFilter id={Status.PROGRAM_CHANGE} />
          <StatusFilter id={Status.CHANNEL_PRESSURE} />
          <StatusFilter id={Status.PITCH_BEND} />
          <StatusFilter id={Status.SYSTEM_EXCLUSIVE} />
          <StatusFilter id={Status.MIDI_TIME_CODE} />
          <StatusFilter id={Status.SONG_POSITION} />
          <StatusFilter id={Status.SONG_SELECT} />
          <StatusFilter id={Status.TUNE_REQUEST} />
          <StatusFilter id={Status.TIMING_CLOCK} />
          <StatusFilter id={Status.START} />
          <StatusFilter id={Status.CONTINUE} />
          <StatusFilter id={Status.STOP} />
          <StatusFilter id={Status.ACTIVE_SENSING} />
          <StatusFilter id={Status.RESET} />
        </FilterList>
      </aside>
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

function MessageInfo({ label, children }) {
  return (
    <div>
      <h3>{label}:&nbsp;</h3>
      {children}
    </div>
  );
}

function FilterList({ filter, changeFilter, children }) {
  return (
    <ul>
      {children.map(child =>
        React.cloneElement(child, {
          key: child.props.id,
          value: filter[child.props.id],
          onChange: value => {
            changeFilter(filter => ({ ...filter, [child.props.id]: value }));
          }
        })
      )}
    </ul>
  );
}

function StatusFilter(props) {
  return <Filter {...props}>{Names[props.id]}</Filter>;
}

function Filter({ value, onChange, children }) {
  return (
    <li>
      <label>
        <input
          className="toggle"
          type="checkbox"
          checked={value}
          onChange={e => {
            onChange(e.target.checked);
          }}></input>
        <span>{children}</span>
      </label>
    </li>
  );
}

window.onload = () => {
  render(<MidiMonitor />, document.getElementById('root'));
};
