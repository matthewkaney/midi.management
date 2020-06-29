import React from 'react';

import { Header } from '../components/Header';

import './styles.css';

export function StyleGuide() {
  return (
    <>
      <Header title="ui" />
      <main className="style-guide">
        <section className="columns">
          <div style={{ flex: 1 }}>
            <BasicTags />
          </div>
          <div style={{ flex: 1, '--steal-bottom': 1 } as React.CSSProperties}>
            <BasicTags />
          </div>
        </section>
      </main>
    </>
  );
}

function BasicTags() {
  return (
    <div>
      <h1>Headers</h1>
      <h2>Second Level</h2>
      <h3>Third Level</h3>
      <h4>Fourth Level</h4>
      <h5>Fifth Level</h5>
      <h6>Sixth Level</h6>
      <p>Paragraph of plain text...</p>
      <p>
        Inline <button>Button</button>
      </p>
      <p>
        Inline <input placeholder="input" />
      </p>
    </div>
  );
}
