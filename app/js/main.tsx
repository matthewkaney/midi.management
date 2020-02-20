import React from 'react';
import { render } from 'react-dom';
import { Router } from '@reach/router';

import { Header } from './Header';

import { MidiMonitor } from './routes/monitor';
import { MidiViewer } from './routes/viewer';

function MidiManagement() {
  return (
    <>
      <Router primary={false}>
        <Header path="/:app" />
      </Router>
      <main>
        <Router>
          <MidiViewer path="viewer" />
          <MidiMonitor path="monitor" />
        </Router>
      </main>
    </>
  );
}

window.onload = () => {
  render(<MidiManagement />, document.getElementById('root'));
};
