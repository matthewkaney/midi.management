import React from 'react';
import { useLocation } from '@reach/router';

type HeaderProps = {
  children: React.ReactNode;
};

export function Header({ children }: HeaderProps) {
  const { pathname } = useLocation();
  let app = pathname.split('/')[1];

  return (
    <header>
      <h1>{app}</h1>
      {children}
    </header>
  );
}
