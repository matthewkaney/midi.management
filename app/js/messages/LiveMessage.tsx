import React from 'react';
import { isChannelMessage, isSystemExclusive } from '@musedlab/midi/messages';

import { ChannelMessage } from './ChannelMessage';
import { UnknownMessage } from './Message';

export function LiveMessage({ message }) {
  if (isChannelMessage(message)) {
    return <ChannelMessage message={message} />;
  } else {
    return <UnknownMessage message={message} />;
  }
}
