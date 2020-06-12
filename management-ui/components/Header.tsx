import React, { useState } from 'react';

type HeaderProps = {
  title: React.ReactNode;
  children: React.ReactNode;
};

export function Header({ title, children }: HeaderProps) {
  return (
    <header>
      {title}
      {children}
    </header>
  );
}

type MenuProps = {
  current: React.ReactNode;
  children: React.ReactNode;
};

export function Menu({ current, children }: MenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`dropdown${open ? ' open' : ''}`} tabIndex={0}>
      <div
        className="head"
        onClick={() => {
          setOpen((o) => !o);
        }}>
        {current}
      </div>
      <nav>
        <ul>{children}</ul>
      </nav>
    </div>
  );
}

type MenuItemProps = {
  children: React.ReactNode;
};

export function MenuItem({ children }: MenuItemProps) {
  return <li>{children}</li>;
}
