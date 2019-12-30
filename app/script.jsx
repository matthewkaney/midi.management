import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';

import { receiveMIDI, receiveMidiInputs } from '@musedlab/midi/web';
import { parseMidiMessage } from '@musedlab/midi/message';
import * as Status from '@musedlab/midi/message/statuses';
import { Names } from './messageNames';

let defaultStatusFilter = {};
for (let status of Object.values(Status)) {
  defaultStatusFilter[status] = true;
}

function MidiMonitor() {
  let [statusFilter, setStatusFilter] = useState(defaultStatusFilter);

  let [midiInputs, setMidiInputs] = useState([]);

  useEffect(() => {
    return receiveMidiInputs(setMidiInputs);
  }, [setMidiInputs]);

  let [messages, setMessages] = useState([]);

  useEffect(() => {
    return receiveMIDI(message => {
      message = parseMidiMessage(message);

      if (statusFilter[message.status]) {
        setMessages(m => [message, ...m]);
      }
    });
  }, [statusFilter, setMessages]);

  return (
    <section>
      <h1>Midi Monitor</h1>
      <h2>Filters</h2>
      <h3>Inputs</h3>
      <FilterList filter={{}}>
        {midiInputs.map(({ id, name, manufacturer }) => (
          <Filter id={id}>
            {manufacturer} {name}
          </Filter>
        ))}
      </FilterList>
      <h3>Devices</h3>
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
      <h3>Messages</h3>
      <h2>Events</h2>
      <ul>
        {messages.map((m, i) => (
          <MidiMessage message={m} key={i} />
        ))}
      </ul>
    </section>
  );
}

function MidiMessage({ message }) {
  return (
    <li>
      <b>
        {new Date(
          performance.timing.navigationStart + message.time
        ).toLocaleTimeString()}
      </b>
      {Names[message.status]}
    </li>
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
      <input
        type="checkbox"
        checked={value}
        onChange={e => {
          onChange(e.target.checked);
        }}></input>
      {children}
    </li>
  );
}

window.onload = () => {
  render(<MidiMonitor />, document.getElementById('root'));
};
