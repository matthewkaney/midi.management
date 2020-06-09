import React from 'react';

type HeaderProps = {
  title: React.ReactNode;
  children: React.ReactNode;
};

export function Header({ title, children }: HeaderProps) {
  return (
    <header>
      <h1>{title}</h1>
      {children}
    </header>
  );
}
