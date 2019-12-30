import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';

import { receiveMIDI } from '@musedlab/midi/web';
import { midiMessage } from '@musedlab/midi/messages';

function MidiMonitor() {
  let [messages, setMessages] = useState([]);
  useEffect(() => {
    return receiveMIDI(
      midiMessage(m => {
        console.log(m);
      })
    );
  }, [setMessages]);

  return (
    <section>
      <h1>Midi Monitor</h1>
      <h2>Events</h2>
      <ul>
        {messages.map(m => (
          <li>{m}</li>
        ))}
      </ul>
      <h2>Filters</h2>
      <h3>Devices</h3>
      <ul>
        <li>Note Off</li>
        <li>Note On</li>
        <li>Control Change</li>
        <li>Pitchbend</li>
      </ul>
      <h3>Messages</h3>
    </section>
  );
}

window.onload = () => {
  render(<MidiMonitor />, document.getElementById('root'));
};
