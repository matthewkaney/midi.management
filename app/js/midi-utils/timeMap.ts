import { TimedMidiMessage } from '@musedlab/midi/types-a762c7a3';
import {
  isMetaMessage,
  SET_TEMPO,
  getTempo
} from '@musedlab/midi/file/messages';

export class TimeMap {
  private resolution = 60;
  private tempos: [number, number, number][] = [];

  constructor(events: TimedMidiMessage[], resolution: number) {
    for (let event of events) {
      if (isMetaMessage(event, { type: SET_TEMPO })) {
        this.tempos.push([event.time, getTempo(event), 0]);
      }
    }
  }

  toSeconds(time: number) {
    // Binary search for closest timestamp
    let first = -1;
    let last = this.tempos.length;

    while (Math.floor(last - first) > 1) {
      let mid = Math.round((last - first) / 2);
      let [midTime] = this.tempos[mid];

      if (time <= midTime) {
        last = mid;
      }

      if (time >= midTime) {
        first = mid;
      }
    }

    // Default values
    let tempoStart = 0;
    let tempo = 120;

    if (first > -1) {
      [tempoStart, tempo] = this.tempos[first];
    }

    return ((time - tempoStart) / this.resolution) * (60 / tempo);
  }

  toPosition(time: number) {}
}
