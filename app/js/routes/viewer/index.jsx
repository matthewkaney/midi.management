import React, { useState, useEffect, useCallback } from 'react';

import { decodeMidiFile } from '@musedlab/midi/file';

import { FileMessage } from '../../components/messages/FileMessage';
import { id } from '../monitor';

export function MidiViewer(props) {
  let [messages, setMessages] = useState([]);

  let [file, setFile] = useState(null);

  useEffect(() => {
    if (file !== null) {
      let cancelled = false;

      file.arrayBuffer().then(buffer => {
        if (!cancelled) {
          let midi = decodeMidiFile(new Uint8Array(buffer));

          let tracks = midi.tracks.map((track, i) =>
            track.map(m => ({
              timeLabel: m.time,
              sourceLabel: `Track ${i + 1}`,
              ...m
            }))
          );

          setMessages(tracks.flat());
        }
      });

      return () => {
        cancelled = true;
      };
    }
  }, [file, setMessages]);

  let listenForDrop = useCallback(
    node => {
      if (node !== null) {
        node.addEventListener('dragenter', e => {
          node.style.background = 'blue';
        });

        node.addEventListener('dragleave', e => {
          node.style.background = 'none';
        });

        node.addEventListener('dragover', e => {
          e.preventDefault();
        });

        node.addEventListener('drop', e => {
          e.preventDefault();

          node.style.background = 'none';

          if (e.dataTransfer.items) {
            for (let item of e.dataTransfer.items) {
              if (item.kind === 'file') {
                let file = item.getAsFile();
                setFile(file);
              }
            }
          }
        });
      }
    },
    [setFile]
  );

  return (
    <section
      className="viewer"
      style={{ height: '100%', width: '100%' }}
      ref={listenForDrop}>
      {messages.map(m => (
        <FileMessage message={m} key={id()} />
      ))}
    </section>
  );
}
