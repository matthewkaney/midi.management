import React from 'react';
import { useLocation } from '@reach/router';

export function Header() {
  const { pathname } = useLocation();
  let app = pathname.split('/')[1];

  return (
    <header>
      <h1>{app}</h1>
    </header>
  );
}
