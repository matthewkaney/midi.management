const pitchClasses = [
  'C',
  'C#/Db',
  'D',
  'D#/Eb',
  'E',
  'F',
  'F#/Gb',
  'G',
  'G#/Ab',
  'A',
  'A#/Bb',
  'B'
];

export function getMidiNoteName(note) {
  return pitchClasses[note % 12];
}
