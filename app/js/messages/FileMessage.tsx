import React from 'react';
import { isChannelMessage, isSystemExclusive } from '@musedlab/midi/messages';

import { ChannelMessage } from './ChannelMessage';

export function FileMessage({ message }) {
  if (isChannelMessage(message)) {
    return <ChannelMessage message={message} />;
  } else if (isSystemExclusive(message)) {
    return null;
  } else {
    return null;
  }
}
