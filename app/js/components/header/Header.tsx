import React from 'react';
import { useLocation } from '@reach/router';

import { Header as BaseHeader } from '../../../../management-ui/components/Header';

type HeaderProps = {
  children: React.ReactNode;
};

export function Header({ children }: HeaderProps) {
  const { pathname } = useLocation();
  let app = pathname.split('/')[1];

  return <BaseHeader title={app}>{children}</BaseHeader>;
}
