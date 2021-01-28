import { memo } from 'react';
import {
  isChannelMessage,
  isSystemExclusive,
  isSystemCommon
} from '@musedlab/midi/messages';

import { ChannelMessage } from './ChannelMessage';
import { MessageDisplayProps, UnknownMessage } from './Message';

export function LiveMessage({ message }: MessageDisplayProps) {
  if (isChannelMessage(message)) {
    return <ChannelMessage message={message} />;
  } else if (isSystemExclusive(message)) {
    return null;
  } else if (isSystemCommon(message)) {
    return null;
  } else {
    return <UnknownMessage message={message} />;
  }
}
