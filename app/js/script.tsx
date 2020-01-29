import React, { useState, useEffect, useCallback } from 'react';
import { render } from 'react-dom';

import { receiveMIDI, receiveMidiInputs } from '@musedlab/midi/web';
import {
  getChannel,
  isNoteOn,
  isNoteOff,
  isKeyPressure,
  isControlChange,
  isProgramChange,
  isPitchBend,
  isChannelPressure,
  isSystemExclusive,
  getSysExVendor,
  getSysExData,
  isTimecode,
  isSongPosition,
  isSongSelect,
  isTuneRequest,
  isClock,
  isStartClock,
  isContinueClock,
  isStopClock,
  isActiveSensing,
  isReset
} from '@musedlab/midi/messages';
import { MessageTypes } from './names/messageTypes';
import { getMidiNoteName } from './names/pitches';
import { getMidiManufacturerName } from './names/sysexVendorNames';

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
          let time = new Date(
            performance.timeOrigin + m.time
          ).toLocaleTimeString();

          let key: number, velocity: number, pressure: number;

          if (isNoteOn(m)) {
            [, key, velocity] = m.data;
            pushMessage(
              <Message key={id()} time={time} name="Note On">
                <Info label="Channel">{getChannel(m) + 1}</Info>
                <Info label="Key">
                  {key} ({getMidiNoteName(key)})
                </Info>
                <Info label="Velocity">
                  {velocity} ({Math.round((velocity / 127) * 100)}%)
                </Info>
              </Message>
            );
          } else if (isNoteOff(m)) {
            [, key, velocity] = m.data;
            pushMessage(
              <Message key={id()} time={time} name="Note Off">
                <Info label="Channel">{getChannel(m) + 1}</Info>
                <Info label="Key">
                  {key} ({getMidiNoteName(key)})
                </Info>
                <Info label="Velocity">
                  {velocity} ({Math.round((velocity / 127) * 100)}%)
                </Info>
              </Message>
            );
          } else if (isKeyPressure(m)) {
            [, key, pressure] = m.data;
            pushMessage(
              <Message key={id()} time={time} name="Key Pressure">
                <Info label="Channel">{getChannel(m) + 1}</Info>
                <Info label="Key">
                  {key} ({getMidiNoteName(key)})
                </Info>
                <Info label="Pressure">{pressure}</Info>
              </Message>
            );
          } else if (isChannelPressure(m)) {
            let [, pressure] = m.data;
            pushMessage(
              <Message key={id()} time={time} name="Channel Pressure">
                <Info label="Channel">{getChannel(m) + 1}</Info>
                <Info label="Pressure">{pressure}</Info>
              </Message>
            );
          } else if (isPitchBend(m)) {
            let [, lsb, msb] = m.data;
            pushMessage(
              <Message key={id()} time={time} name="Pitch Bend">
                <Info label="Channel">{getChannel(m) + 1}</Info>
                <Info label="Pitch Bend">{msb}</Info>
              </Message>
            );
          } else if (isControlChange(m)) {
            let [, controller, value] = m.data;
            pushMessage(
              <Message key={id()} time={time} name="Control Change">
                <Info label="Channel">{getChannel(m) + 1}</Info>
                <Info label="Controller">{controller}</Info>
                <Info label="Value">{value}</Info>
              </Message>
            );
          } else if (isProgramChange(m)) {
          } else if (isSystemExclusive(m)) {
            let manufacturer = getSysExVendor(m);
            let sysExData = getSysExData(m);
            pushMessage(
              <Message key={id()} time={time} name="System Exclusive">
                <Info label="Manufacturer">
                  <Hex data={manufacturer} /> (
                  {getMidiManufacturerName(manufacturer)})
                </Info>
                <Info label="Data">
                  <Hex data={sysExData} />
                </Info>
              </Message>
            );
          } else if (isTimecode(m)) {
          } else if (isSongPosition(m)) {
          } else if (isSongSelect(m)) {
          } else if (isTuneRequest(m)) {
          } else if (isClock(m)) {
            pushMessage(<Message key={id()} time={time} name="Clock Tick" />);
          } else if (isStartClock(m)) {
            pushMessage(<Message key={id()} time={time} name="Clock Start" />);
          } else if (isContinueClock(m)) {
            pushMessage(
              <Message key={id()} time={time} name="Clock Continue" />
            );
          } else if (isStopClock(m)) {
            pushMessage(<Message key={id()} time={time} name="Clock Stop" />);
          } else if (isActiveSensing(m)) {
            pushMessage(
              <Message key={id()} time={time} name="Active Sensing" />
            );
          } else if (isReset(m)) {
            pushMessage(<Message key={id()} time={time} name="Reset" />);
          } else {
            pushMessage(
              <Message key={id()} time={time} name="UNRECOGNIZED MESSAGE">
                <Info label="Data">
                  <Hex data={m.data} />
                </Info>
              </Message>
            );
          }
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

function Message({ time, name, children = undefined }) {
  return (
    <article>
      <header>
        <time>{time}</time>
        <h2>{name}</h2>
      </header>
      <div className="message-info">{children}</div>
    </article>
  );
}

function Hex({ data }) {
  return (
    <>
      {[...data]
        .map(n => n.toString(16).padStart(2, '0'))
        .join(' ')
        .toUpperCase()}
    </>
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
