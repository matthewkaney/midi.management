import React from 'react';
import { isChannelMessage, isSystemExclusive } from '@musedlab/midi/messages';
import { isMetaMessage } from '@musedlab/midi/file/messages';

import { ChannelMessage } from './ChannelMessage';
import { MetaMessage } from './MetaMessage';
import { UnknownMessage } from './Message';

export function FileMessage({ message }) {
  if (isChannelMessage(message)) {
    return <ChannelMessage message={message} />;
  } else if (isMetaMessage(message)) {
    return <MetaMessage message={message} />;
  } else {
    return <UnknownMessage message={message} />;
  }
}
