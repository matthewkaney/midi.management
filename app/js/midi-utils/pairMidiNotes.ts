import { TimedMidiMessage } from '@musedlab/midi/types-a762c7a3';
import { isNoteOn, isNoteOff, getChannel } from '@musedlab/midi/messages';

class MIDINoteSet {
  private notes = new Map<number, TimedMidiMessage[]>();

  noteOn(event: TimedMidiMessage) {
    if (isNoteOn(event)) {
      let [, key] = event.data;

      if (!this.notes.has(key)) {
        this.notes.set(key, []);
      }

      this.notes.get(key)?.push(event);

      return { ...event, duration: Infinity };
    }

    return null;
  }

  noteOff(event: TimedMidiMessage) {
    if (isNoteOff(event)) {
      let [, key] = event.data;

      if (this.notes.has(key)) {
        let events = this.notes.get(key);

        let onEvent = events?.pop();

        return { ...onEvent, duration: event.time - onEvent.time };
      }
    }
  }
}

export function pairMIDINotes(events: TimedMidiMessage[]) {
  for (let event of events) {
    if (isNoteOn(event)) {
    }
  }
}
