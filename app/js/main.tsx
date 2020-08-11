import React from "react";
import { render } from "react-dom";
import { Router } from "@reach/router";

import { LandingPage } from "./routes/landing";
import { MidiDevices } from "./routes/devices";
import { MidiMonitor } from "./routes/monitor";
import { MidiViewer } from "./routes/viewer";
import { MidiLive } from "./routes/live";

// Dev Only
import { StyleGuide } from "../../management-ui/styleguide";

function MidiManagement() {
  return (
    <Router>
      <MidiDevices path="devices" />
      {/* <MidiViewer path="viewer" /> */}
      {/* <MidiMonitor path="monitor" /> */}
      {/* <MidiLive path="live/*" /> */}
      <LandingPage path="/" />

      {process.env.NODE_ENV === "development" ? <StyleGuide path="ui" /> : null}
    </Router>
  );
}

window.onload = () => {
  render(<MidiManagement />, document.getElementById("root"));
};
