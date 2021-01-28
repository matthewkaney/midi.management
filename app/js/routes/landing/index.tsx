import "./style.css";

import { RouteComponentProps } from "@reach/router";

export function LandingPage(props: RouteComponentProps) {
  return (
    <main>
      <div className="landing-header">
        <h1 className="big">midi.management</h1>
        <p>
          Useful tools for working with MIDI sequences, messages and hardware in
          the browser.
        </p>
        <p>Coming soon...</p>
      </div>
    </main>
  );
}
