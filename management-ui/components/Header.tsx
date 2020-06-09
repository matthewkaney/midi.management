import React from 'react';

type HeaderProps = {
  title: React.ReactNode;
  children: React.ReactNode;
};

export function Header({ title, children }: HeaderProps) {
  return (
    <header>
      <div className="dropdown" tabIndex={0}>
        <div className="head">
          <h1>{title}</h1>
        </div>
        <nav>
          <ul>
            <li>devices</li>
            <li>monitor</li>
          </ul>
        </nav>
      </div>
      {children}
    </header>
  );
}
