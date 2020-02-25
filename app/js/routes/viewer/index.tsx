import React, { useState, useEffect, useCallback } from 'react';

import { decodeMidiFile } from '@musedlab/midi/file';

import { FileMessage } from '../../components/messages/FileMessage';
import { MidiMessage } from '@musedlab/midi/types-a762c7a3';
import { SourceMessageGroup } from '../../components/messages/SourceMessageGroup';

export function MidiViewer() {
  interface TrackMessageList {
    id: number;
    name: string;
    messages: MidiMessage[][];
  }

  let [messages, setMessages] = useState<TrackMessageList[]>([]);

  let [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (file !== null) {
      let cancelled = false;

      file.arrayBuffer().then(buffer => {
        if (!cancelled) {
          let midi = decodeMidiFile(new Uint8Array(buffer));

          setMessages(
            midi.tracks.map((track, i) => ({
              id: i,
              name: `Track ${i + 1}`,
              messages: [
                track.map((m, j) => ({
                  timeLabel: m.time,
                  id: j,
                  ...m
                }))
              ]
            }))
          );
        }
      });

      return () => {
        cancelled = true;
      };
    }
  }, [file, setMessages]);

  let listenForDrop = useCallback(
    (node: HTMLElement) => {
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

          if (e.dataTransfer && e.dataTransfer.items) {
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
    <div className="container">
      <section className="viewer scroll" ref={listenForDrop}>
        {messages.map(({ name, messages }, i) => (
          <SourceMessageGroup
            name={name}
            type={FileMessage}
            messages={messages}
            key={i}
          />
        ))}
      </section>
    </div>
  );
}
