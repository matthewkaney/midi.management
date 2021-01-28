import {
  isMetaMessage,
  TEXT_EVENT,
  COPYRIGHT,
  TRACK_NAME,
  INSTRUMENT_NAME,
  LYRIC,
  MARKER,
  CUE_POINT,
  SET_TEMPO,
  TIME_SIGNATURE,
  END_OF_TRACK,
  getText,
  getTempo,
  getTimeSignature
} from '@musedlab/midi/file/messages';
import { Message, Info, Hex } from './Message';

export function MetaMessage({ message }) {
  if (isMetaMessage(message, { type: TEXT_EVENT })) {
    return (
      <Message message={message} name="Meta: Text Event">
        <Info label="Text">{getText(message)}</Info>
      </Message>
    );
  } else if (isMetaMessage(message, { type: COPYRIGHT })) {
    return (
      <Message message={message} name="Meta: Copyright Information">
        <Info label="Text">{getText(message)}</Info>
      </Message>
    );
  } else if (isMetaMessage(message, { type: TRACK_NAME })) {
    return (
      <Message message={message} name="Meta: Track Name">
        <Info label="Text">{getText(message)}</Info>
      </Message>
    );
  } else if (isMetaMessage(message, { type: INSTRUMENT_NAME })) {
    return (
      <Message message={message} name="Meta: Instrument Name">
        <Info label="Text">{getText(message)}</Info>
      </Message>
    );
  } else if (isMetaMessage(message, { type: LYRIC })) {
    return (
      <Message message={message} name="Meta: Lyric">
        <Info label="Text">{getText(message)}</Info>
      </Message>
    );
  } else if (isMetaMessage(message, { type: MARKER })) {
    return (
      <Message message={message} name="Meta: Marker">
        <Info label="Text">{getText(message)}</Info>
      </Message>
    );
  } else if (isMetaMessage(message, { type: CUE_POINT })) {
    return (
      <Message message={message} name="Meta: Cue Point">
        <Info label="Text">{getText(message)}</Info>
      </Message>
    );
  } else if (isMetaMessage(message, { type: SET_TEMPO })) {
    return (
      <Message message={message} name="Meta: Tempo">
        <Info label="Tempo">{getTempo(message)} bpm</Info>
      </Message>
    );
  } else if (isMetaMessage(message, { type: TIME_SIGNATURE })) {
    return <Message message={message} name="Meta: Time Signature" />;
  } else if (isMetaMessage(message, { type: END_OF_TRACK })) {
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
