import React from 'react';

export function MidiSupport({ fallback = null, children }) {
  if (navigator.requestMidiAccess) {
    return children;
  } else {
    return fallback;
  }
}
