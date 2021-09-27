import { useState, useEffect } from "react";

// Import only used for types
import "@musedlab/midi/web";

type MIDISupportProps = {
  sysex?: boolean;
  notSupported?: React.ReactNode;
  notEnabled?: React.ReactNode;
  children: React.ReactNode;
};

export function OldMIDISupport({
  notSupported = null,
  notEnabled = null,
  children
}: MIDISupportProps) {
  const [access, setAccess] = useState("prompt");

  useEffect(() => {
    if ("requestMIDIAccess" in navigator) {
      let dispose = () => {};

      if (navigator.permissions) {
        navigator.permissions.query({ name: "midi" }).then(midiPermission => {
          const update = () => {
            setAccess(midiPermission.state);
          };

          update();
          midiPermission.addEventListener("change", update);
          dispose = () => {
            midiPermission.removeEventListener("change", update);
          };
        });
      }

      return () => {
        dispose();
      };
    }
  }, [setAccess]);

  // if ("requestMIDIAccess" in navigator) {
  //   if (access === "granted") {
  //     return children || null;
  //   } else {
  //     return notEnabled || null;
  //   }
  // } else {
  //   return notSupported || null;
  // }

  return <>{"requestMIDIAccess" in navigator ? children : notSupported}</>;
}

export function MIDISupport({ sysex, children }: MIDISupportProps) {
  const [access, setAccess] = useState<MIDIAccess>();

  useEffect(() => {
    navigator.requestMIDIAccess({ sysex: true });
  });

  return <>{children}</>;
}

interface MIDIDeviceProps {
  device: string;
  children?: React.ReactNode;
}

import { createContext, useContext } from "react";

const midiDeviceContext = createContext<string | null>(null);

export function MIDIDevice({ device, children }: MIDIDeviceProps) {
  return (
    <midiDeviceContext.Provider value={device}>
      {children}
    </midiDeviceContext.Provider>
  );
}

export function useMIDIInput() {
  const midiDevice = useContext(midiDeviceContext);
}
