import React from 'react';
import { render } from 'react-dom';
import { Router } from '@reach/router';

import { MidiDevices } from './routes/devices';
import { MidiMonitor } from './routes/monitor';
import { MidiViewer } from './routes/viewer';
import { MidiLive } from './routes/live';

function MidiManagement() {
  return (
    <Router>
      <MidiDevices path="devices" />
      <MidiViewer path="viewer" />
      <MidiMonitor path="monitor" />
      <MidiLive path="live/*" />
    </Router>
  );
}

window.onload = () => {
  render(<MidiManagement />, document.getElementById('root'));
};
