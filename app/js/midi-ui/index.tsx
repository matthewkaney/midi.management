import { useState, useEffect } from "react";

// Import only used for types
import "@musedlab/midi/web";

type MIDISupportProps = {
  notSupported?: React.ReactNode;
  notEnabled?: React.ReactNode;
  children: React.ReactNode;
};

export function MIDISupport({
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
