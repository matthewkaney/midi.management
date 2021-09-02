import { useState, useEffect, useCallback } from "react";

export function useMIDIPortList() {}

export function useMIDIInput(handler: (message: MIDIMessageEvent) => any) {
  const memoedHandler = useCallback(handler, []);

  useEffect(() => {
    navigator.requestMIDIAccess({ sysex: true }).then(access => {
      for (let input of access.inputs.values()) {
        input.addEventListener("midimessage", memoedHandler);
      }

      return () => {
        for (let input of access.inputs.values()) {
          input.removeEventListener("midimessage", memoedHandler);
        }
      };
    });
  }, [memoedHandler]);
}
