import React from 'react';
import { render } from 'react-dom';
import { Router } from '@reach/router';

import { MidiMonitor } from './routes/monitor';
import { MidiViewer } from './routes/viewer';

function MidiManagement() {
  return (
    <>
      <header>midi.management</header>
      <Router>
        <MidiMonitor path="monitor" />
        <MidiViewer path="viewer" />
      </Router>
    </>
  );
}

window.onload = () => {
  render(<MidiManagement />, document.getElementById('root'));
};
