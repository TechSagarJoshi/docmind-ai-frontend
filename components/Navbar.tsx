"use client";

import Header from "./Header";

type Props = {
  userEmail?: string;
  onLogout?: () => void;
};

export default function Navbar(_props: Props) {
  return <Header />;
}