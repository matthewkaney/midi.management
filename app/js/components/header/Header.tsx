import { useLocation, Link } from "@reach/router";

import {
  Header as BaseHeader,
  Menu,
  MenuItem
} from "../../../../management-ui/components/Header";

const links = ["devices", "monitor"];

type HeaderProps = {
  children?: React.ReactNode;
};

export function Header({ children }: HeaderProps) {
  const { pathname } = useLocation();
  const app = pathname.split("/")[1];

  return <BaseHeader title={app}>{children}</BaseHeader>;
}
