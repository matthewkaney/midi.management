import React, { useState, useEffect } from 'react';

import { receiveMidiInputs, receiveMidiOutputs } from '@musedlab/midi/web';

import { Header } from '../../components/header/Header';

import './style.css';

export function MidiDevices() {
  const [inputs, setInputs] = useState<MIDIInput[]>([]);
  useEffect(() =>
    receiveMidiInputs((i) => {
      setInputs(i);
    })
  );

  const [outputs, setOutputs] = useState<MIDIOutput[]>([]);
  useEffect(() =>
    receiveMidiOutputs((o) => {
      setOutputs(o);
    })
  );

  return (
    <>
      <Header />
      <main>
        <div className="container">
          <div className="device-list">
            <h2>Inputs</h2>
            <ul>
              {inputs.map((i) => (
                <li key={i.id}>
                  {i.name}
                  {i.manufacturer ? `: ${i.manufacturer}` : null}
                </li>
              ))}
            </ul>
          </div>
          <div className="device-list">
            <h2>Outputs</h2>
            <ul>
              {outputs.map((i) => (
                <li key={i.id}>
                  {i.name}
                  {i.manufacturer ? `: ${i.manufacturer}` : null}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}
