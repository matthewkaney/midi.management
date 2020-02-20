import React from 'react';

// Import only used for types
import '@musedlab/midi/web';

export function MidiSupport({ fallback = null, children }) {
  if (navigator.requestMIDIAccess) {
    return children;
  } else {
    return fallback;
  }
}
