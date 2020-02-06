import React from 'react';

import {
  getText,
  isTextEvent,
  isCopyright,
  isTrackName,
  isInstrumentName,
  isLyric,
  isMarker,
  isCuePoint,
  isEndOfTrack
} from '@musedlab/midi/file/messages';
import { Message, Info, Hex } from './Message';

export function MetaMessage({ message }) {
  if (isTextEvent(message)) {
    return (
      <Message message={message} name="Meta: Text Event">
        <Info label="Text">{getText(message)}</Info>
      </Message>
    );
  } else if (isCopyright(message)) {
    return (
      <Message message={message} name="Meta: Copyright Information">
        <Info label="Text">{getText(message)}</Info>
      </Message>
    );
  } else if (isTrackName(message)) {
    return (
      <Message message={message} name="Meta: Track Name">
        <Info label="Text">{getText(message)}</Info>
      </Message>
    );
  } else if (isInstrumentName(message)) {
    return (
      <Message message={message} name="Meta: Instrument Name">
        <Info label="Text">{getText(message)}</Info>
      </Message>
    );
  } else if (isLyric(message)) {
    return (
      <Message message={message} name="Meta: Lyric">
        <Info label="Text">{getText(message)}</Info>
      </Message>
    );
  } else if (isMarker(message)) {
    return (
      <Message message={message} name="Meta: Marker">
        <Info label="Text">{getText(message)}</Info>
      </Message>
    );
  } else if (isCuePoint(message)) {
    return (
      <Message message={message} name="Meta: Cue Point">
        <Info label="Text">{getText(message)}</Info>
      </Message>
    );
  } else if (isEndOfTrack(message)) {
    return <Message message={message} name="Meta: End of Track" />;
  } else {
    return (
      <Message message={message} name="Meta: (Unrecognized)">
        <Info label="Data">
          <Hex data={message.data} />
        </Info>
      </Message>
    );
  }
}
