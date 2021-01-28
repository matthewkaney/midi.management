import { MIDIData, MIDIMessage } from "@musedlab/midi";

export type MessageDisplayProps = {
  message: MIDIMessage & { timeLabel: string; sourceLabel: string };
};

export function UnknownMessage({ message }: MessageDisplayProps) {
  return (
    <Message name="Unrecognized Message" message={message}>
      <Info label="Data">
        <Hex data={message.data} />
      </Info>
    </Message>
  );
}

type MessageProps = MessageDisplayProps & {
  name: string;
  children?: React.ReactNode;
};

export function Message({ message, name, children = undefined }: MessageProps) {
  return (
    <article className="midi-message">
      <header>
        <time>{message.timeLabel}</time>
        <h2>{name}</h2>
        <div className="source">{message.sourceLabel}</div>
      </header>
      <div className="message-info">{children}</div>
    </article>
  );
}

type HexProps = {
  data: MIDIData;
};

export function Hex({ data }: HexProps) {
  return (
    <>
      {[...data]
        .map(n => n.toString(16).padStart(2, "0"))
        .join(" ")
        .toUpperCase()}
    </>
  );
}

type InfoProps = {
  label: string;
  children?: React.ReactNode;
};

export function Info({ label, children }: InfoProps) {
  return (
    <div>
      <h3>{label}:&nbsp;</h3>
      {children}
    </div>
  );
}
