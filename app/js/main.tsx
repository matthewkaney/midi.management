import React from 'react';
import { render } from 'react-dom';
import { Router } from '@reach/router';

import { MidiMonitor } from './script';
import { MidiViewer } from './viewer';

function MidiManagement() {
  return (
    <Router>
      <MidiViewer path="viewer" />
      <MidiMonitor path="monitor" />
    </Router>
  );
}

window.onload = () => {
  render(<MidiManagement />, document.getElementById('root'));
};
