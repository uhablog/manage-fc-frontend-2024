'use client'
import { AccountBalance, Home } from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import Link from "next/link";
import { useState } from "react";

const nav_items = [
  {
    value: '/conventions',
    label: '大会',
    icon: <Home/>,
    href: '/conventions'
  },
  {
    value: '/user',
    label: 'ユーザー',
    icon: <AccountBalance/>,
    href: '/user'
  }
];

const MobileBottomNav = () => {

  const [value, setValue] = useState<string>('conventions');

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      showLabels
      sx={{
        display: { xs: 'flex', md: 'none' }, // xsからsmまで表示、md以上で非表示
        width: '100%',
        position: 'fixed',
        bottom: 0,
      }}
    >
      {nav_items.map((item, index) => (
        <BottomNavigationAction key={index} value={item.value} label={item.label} icon={item.icon} LinkComponent={Link} href={item.href} />
      ))}
    </BottomNavigation>
  )
};

export default MobileBottomNav;