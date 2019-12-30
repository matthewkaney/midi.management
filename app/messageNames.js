import * as Status from '@musedlab/midi/message/statuses';

export const Names = {
  [Status.NOTE_OFF]: 'Note Off',
  [Status.NOTE_ON]: 'Note On',
  [Status.KEY_PRESSURE]: 'Key Pressure',
  [Status.CONTROL_CHANGE]: 'Control Change',
  [Status.PROGRAM_CHANGE]: 'Program Change',
  [Status.CHANNEL_PRESSURE]: 'Channel Pressure',
  [Status.PITCH_BEND]: 'Pitch Bend',
  [Status.SYSTEM_EXCLUSIVE]: 'System Exclusive',
  [Status.MIDI_TIME_CODE]: 'Midi Time Code',
  [Status.SONG_POSITION]: 'Song Position',
  [Status.SONG_SELECT]: 'Song Select',
  [Status.TUNE_REQUEST]: 'Tune Request',
  [Status.TIMING_CLOCK]: 'Clock',
  [Status.START]: 'Start',
  [Status.CONTINUE]: 'Continue',
  [Status.STOP]: 'Stop',
  [Status.ACTIVE_SENSING]: 'Active Sensing',
  [Status.RESET]: 'Reset'
};
