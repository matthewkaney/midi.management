import React, { useState, useEffect, useCallback } from 'react';
import { render } from 'react-dom';

import { receiveMIDI, receiveMidiInputs } from '@musedlab/midi/web';
import {
  onNoteOn,
  onNoteOff,
  onKeyPressure,
  onControlChange,
  onPitchBend,
  onChannelPressure,
  onSystemExclusive,
  onSongPosition,
  onTimingClock,
  onTimingStart,
  onTimingContinue,
  onTimingStop
} from '@musedlab/midi/message';
import { MessageTypes } from './data/messageTypes';
import { getMidiManufacturerName } from './data/sysexVendorNames';

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

          let message = (
            <Message key={id()} time={time} name="UNRECOGNIZED MESSAGE">
              <Info label="Data">
                <Hex data={rawMessage.data} />
              </Info>
            </Message>
          );

          onNoteOn(({ channel, key, velocity }) => {
            message = (
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
            message = (
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
            message = (
              <Message key={id()} time={time} name="Key Pressure">
                <Info label="Channel">{channel}</Info>
                <Info label="Key">{key}</Info>
                <Info label="Pressure">{value}</Info>
              </Message>
            );
          })(rawMessage);

          onControlChange(({ channel, controller, value }) => {
            message = (
              <Message key={id()} time={time} name="Control Change">
                <Info label="Channel">{channel}</Info>
                <Info label="Controller">{controller}</Info>
                <Info label="Value">{value}</Info>
              </Message>
            );
          })(rawMessage);

          onPitchBend(({ channel, value }) => {
            message = (
              <Message key={id()} time={time} name="Pitch Bend">
                <Info label="Channel">{channel}</Info>
                <Info label="Value">{value}</Info>
              </Message>
            );
          })(rawMessage);

          onChannelPressure(({ channel, value }) => {
            message = (
              <Message key={id()} time={time} name="Channel Pressure">
                <Info label="Channel">{channel}</Info>
                <Info label="Value">{value}</Info>
              </Message>
            );
          })(rawMessage);

          onSystemExclusive(({ manufacturer, data }) => {
            message = (
              <Message key={id()} time={time} name="System Exclusive">
                <Info label="Manufacturer">
                  <Hex data={manufacturer} /> (
                  {getMidiManufacturerName(manufacturer)})
                </Info>
                <Info label="Data">
                  <Hex data={data} />
                </Info>
              </Message>
            );
          })(rawMessage);

          onSongPosition(({ position }) => {
            message = (
              <Message key={id()} time={time} name="Song Position">
                <Info label="Position">{position}</Info>
              </Message>
            );
          })(rawMessage);

          onTimingClock(() => {
            message = <Message key={id()} time={time} name="Clock Tick" />;
          })(rawMessage);

          onTimingStart(() => {
            message = <Message key={id()} time={time} name="Clock Start" />;
          })(rawMessage);

          onTimingStop(() => {
            message = <Message key={id()} time={time} name="Clock Stop" />;
          })(rawMessage);

          onTimingContinue(() => {
            message = <Message key={id()} time={time} name="Clock Continue" />;
          })(rawMessage);

          pushMessage(message);
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
