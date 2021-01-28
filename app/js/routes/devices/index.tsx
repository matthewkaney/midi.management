import { useState, useEffect } from "react";

import { RouteComponentProps } from "@reach/router";

import {
  receiveMidiInputs,
  receiveMidiOutputs,
  receiveMIDI
} from "@musedlab/midi/web";

import { MIDISupport } from "../../midi-ui/index";

import { Header } from "../../components/header/Header";

import "./style.css";

export function MidiDevices(props: RouteComponentProps) {
  const [inputs, setInputs] = useState<MIDIInput[]>([]);
  useEffect(
    () =>
      receiveMidiInputs(i => {
        setInputs(i);
      }),
    [setInputs]
  );

  const [outputs, setOutputs] = useState<MIDIOutput[]>([]);
  useEffect(
    () =>
      receiveMidiOutputs(o => {
        setOutputs(o);
      }),
    [setOutputs]
  );

  return (
    <>
      <Header />
      <MIDISupport>
        <main className="columns">
          <div className="device-list">
            <h2>Inputs</h2>
            <ul>
              {inputs.map(i => (
                <DeviceListing key={i.id} device={i} />
              ))}
            </ul>
          </div>
          <div className="device-list">
            <h2>Outputs</h2>
            <ul>
              {outputs.map(o => (
                <DeviceListing key={o.id} device={o} />
              ))}
            </ul>
          </div>
        </main>
      </MIDISupport>
    </>
  );
}

type DeviceListingProps = {
  device: MIDIInput | MIDIOutput;
};

function DeviceListing({ device }: DeviceListingProps) {
  return (
    <li>
      <div className={`name ${device.type}`}>
        {device.name}
        {device.type === "input" ? <TinyMonitor device={device} /> : null}
      </div>
      {device.manufacturer ? `: ${device.manufacturer}` : null}
    </li>
  );
}

type TinyMonitorProps = {
  device: MIDIInput;
};

function TinyMonitor({ device }: TinyMonitorProps) {
  let [isOn, setIsOn] = useState(false);

  useEffect(() => {
    let timer: number;

    const closeMIDI = receiveMIDI(m => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        setIsOn(false);
      }, 100);

      setIsOn(true);
    }, device.id);

    return () => {
      window.clearTimeout(timer);
      closeMIDI();
    };
  }, [device, setIsOn]);

  return <div className={`tiny-monitor${isOn ? " on" : ""}`} />;
}
