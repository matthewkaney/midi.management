import React from 'react';
import { useLocation, Link } from '@reach/router';

import {
  Header as BaseHeader,
  Menu,
  MenuItem,
} from '../../../../management-ui/components/Header';

const links = ['devices', 'monitor'];

type HeaderProps = {
  children: React.ReactNode;
};

export function Header({ children }: HeaderProps) {
  const { pathname } = useLocation();
  const app = pathname.split('/')[1];

  return (
    <BaseHeader
      title={
        <Menu current={<h1>{app}</h1>}>
          {links.map((l) => (
            <MenuItem key={l}>
              <Link to={`/${l}`}>{l}</Link>
            </MenuItem>
          ))}
        </Menu>
      }>
      {children}
    </BaseHeader>
  );
}
