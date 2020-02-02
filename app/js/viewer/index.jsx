import React, { useState, useEffect, useCallback } from 'react';

import { decodeMidiFile } from '@musedlab/midi/file';

import { fromDataBytes } from '@musedlab/midi/data';
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

import { FileMessage } from '../messages/FileMessage';
import { id, Message, Info, Hex } from '../monitor';

import { getMidiNoteName } from '../names/pitches';
import { getMidiManufacturerName } from '../names/sysexVendorNames';

export function MidiViewer(props) {
  let [messages, setMessages] = useState([]);

  let [file, setFile] = useState(null);

  useEffect(() => {
    if (file !== null) {
      let cancelled = false;

      file.arrayBuffer().then(buffer => {
        if (!cancelled) {
          let midi = decodeMidiFile(new Uint8Array(buffer));

          setMessages(midi.tracks.flat());
        }
      });

      return () => {
        cancelled = true;
      };
    }
  }, [file, setMessages]);

  let listenForDrop = useCallback(
    node => {
      if (node !== null) {
        node.addEventListener('dragenter', e => {
          node.style.background = 'blue';
        });

        node.addEventListener('dragleave', e => {
          node.style.background = 'none';
        });

        node.addEventListener('dragover', e => {
          e.preventDefault();
        });

        node.addEventListener('drop', e => {
          e.preventDefault();

          node.style.background = 'none';

          if (e.dataTransfer.items) {
            for (let item of e.dataTransfer.items) {
              if (item.kind === 'file') {
                let file = item.getAsFile();
                setFile(file);
              }
            }
          }
        });
      }
    },
    [setFile]
  );

  return (
    <section
      className="viewer"
      style={{ height: '100%', width: '100%' }}
      ref={listenForDrop}>
      {messages.map(m => (
        <FileMessage message={m} key={id()} />
      ))}
    </section>
  );
}

/*
function renderMessage(m) {
  let { time } = m;
  let key, velocity, pressure;

  if (isNoteOn(m)) {
    [, key, velocity] = m.data;
    return (
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
    return (
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
    return (
      <Message key={id()} time={time} name="Key Pressure">
        <Info label="Channel">{getChannel(m) + 1}</Info>
        <Info label="Key">
          {key} ({getMidiNoteName(key)})
        </Info>
        <Info label="Pressure">
          {pressure} ({Math.round((pressure / 127) * 100)}%)
        </Info>
      </Message>
    );
  } else if (isChannelPressure(m)) {
    let [, pressure] = m.data;
    return (
      <Message key={id()} time={time} name="Channel Pressure">
        <Info label="Channel">{getChannel(m) + 1}</Info>
        <Info label="Pressure">
          {pressure} ({Math.round((pressure / 127) * 100)}%)
        </Info>
      </Message>
    );
  } else if (isPitchBend(m)) {
    let [, lsb, msb] = m.data;
    let bend = fromDataBytes([msb, lsb]);
    let bendPercent = Math.round((bend / 8192 - 1) * 100);
    return (
      <Message key={id()} time={time} name="Pitch Bend">
        <Info label="Channel">{getChannel(m) + 1}</Info>
        <Info label="Pitch Bend">
          {bend} ({Math.sign(bendPercent) === 1 ? '+' : ''}
          {bendPercent}%)
        </Info>
      </Message>
    );
  } else if (isControlChange(m)) {
    let [, controller, value] = m.data;
    return (
      <Message key={id()} time={time} name="Control Change">
        <Info label="Channel">{getChannel(m) + 1}</Info>
        <Info label="Controller">{controller}</Info>
        <Info label="Value">{value}</Info>
      </Message>
    );
  } else if (isProgramChange(m)) {
    let [, program] = m.data;
    return (
      <Message key={id()} time={time} name="Program Change">
        <Info label="Channel">{getChannel(m) + 1}</Info>
        <Info label="Program">{program}</Info>
      </Message>
    );
  } else if (isSystemExclusive(m)) {
    let manufacturer = getSysExVendor(m);
    let sysExData = getSysExData(m);
    return (
      <Message key={id()} time={time} name="System Exclusive">
        <Info label="Manufacturer">
          <Hex data={manufacturer} /> ({getMidiManufacturerName(manufacturer)})
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
    return <Message key={id()} time={time} name="Clock Tick" />;
  } else if (isStartClock(m)) {
    return <Message key={id()} time={time} name="Clock Start" />;
  } else if (isContinueClock(m)) {
    return <Message key={id()} time={time} name="Clock Continue" />;
  } else if (isStopClock(m)) {
    return <Message key={id()} time={time} name="Clock Stop" />;
  } else if (isActiveSensing(m)) {
    return <Message key={id()} time={time} name="Active Sensing" />;
  } else if (isReset(m)) {
    return <Message key={id()} time={time} name="Reset" />;
  } else {
    return (
      <Message key={id()} time={time} name="UNRECOGNIZED MESSAGE">
        <Info label="Data">
          <Hex data={m.data} />
        </Info>
      </Message>
    );
  }
}*/
