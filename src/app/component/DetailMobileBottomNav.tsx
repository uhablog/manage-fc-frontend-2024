'use client'
import { AccountCircle, CalendarMonth, FormatListNumbered, Home, SportsSoccer } from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const DetailMobileBottomNav = () => {

  const [value, setValue] = useState<string>('conventions');
  const pathname = usePathname();
  const convention_id = pathname.split('/').slice(2)[0];

  const detail_nav_items = [
    {
      value: '/conventions',
      label: '大会',
      icon: <Home/>,
      href: '/conventions'
    },
    {
      value: `/conventions/${convention_id}`,
      label: '試合結果',
      icon: <CalendarMonth/>,
      href: `/conventions/${convention_id}`
    },
    {
      value: `/conventions/${convention_id}/ranking`,
      label: '順位表',
      icon: <FormatListNumbered/>,
      href: `/conventions/${convention_id}/ranking`
    },
    {
      value: `/conventions/${convention_id}/score`,
      label: '得点王',
      icon: <SportsSoccer/>,
      href: `/conventions/${convention_id}/score`
    },
    {
      value: '/user',
      label: 'ユーザー',
      icon: <AccountCircle/>,
      href: '/user'
    }
  ];

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
        bottom: 100,
      }}
    >
      {detail_nav_items.map((item, index) => (
        <BottomNavigationAction key={index} value={item.value} label={item.label} icon={item.icon} LinkComponent={Link} href={item.href} />
      ))}
    </BottomNavigation>
  )
};

export default DetailMobileBottomNav;