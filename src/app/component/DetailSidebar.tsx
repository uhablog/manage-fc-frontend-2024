'use client';
import { Box, Drawer, List, ListItem, ListItemIcon, Link as MuiLink, Typography, useTheme } from "@mui/material";
import { AccountBox, CalendarMonth, FormatListNumbered, Home, Info, Numbers, SportsSoccer } from "@mui/icons-material";
import NextLink from "next/link";
import { usePathname } from "next/navigation";


const drawerWidth = 240;

function DetailSidebar() {

  const pathname = usePathname();
  const convention_id = pathname.split('/').slice(2)[0];

  // サイドバーの中で上に表示される項目
  const list_items = [
    {
      title: '大会一覧',
      icon: <Home/>,
      href: '/conventions'
    },
    {
      title: '試合一覧',
      icon: <CalendarMonth/>,
      href: `/conventions/${convention_id}`
    },
    {
      title: '順位表',
      icon: <FormatListNumbered/>,
      href: `/conventions/${convention_id}/ranking`
    },
    {
      title: '得点王',
      icon: <SportsSoccer/>,
      href: `/conventions/${convention_id}/score`
    }
  ];

  // サイドバーの中で下に表示される項目
  const bottom_items = [
    {
      title: 'ユーザー情報',
      icon: <AccountBox/>,
      href: '/user'
    }
  ]

  const theme = useTheme();

  return (
    <>
      <Drawer 
        variant="permanent"
        anchor="left"
        sx={{
          [theme.breakpoints.up('md')]: {
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          },
          [theme.breakpoints.down('sm')]: {
            width: 0, // これを追加
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              display: 'none',
            },
          },
        }}
      >
        <Box sx={{ overflow: 'auto' }} >
          <List>
            {list_items.map(( item, index ) => (
              <MuiLink component={NextLink} underline="none" href={item.href} key={index}>
                <ListItem>
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <Typography component='div' sx={{ color: 'black' }} >{item.title}</Typography>
                </ListItem>
              </MuiLink>
            ))}
          </List>
        </Box>
        {/* これ以降の記述はサイドバーの下に表示される */}
        <Box flexGrow={1} /> {/* This will push the content below it to the bottom */}
        <Box>
          <List>
            {bottom_items.map(( item, index ) => (
              <MuiLink component={NextLink} underline="none" href={item.href} key={index}>
                <ListItem>
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <Typography component='div' sx={{ color: 'black' }} >{item.title}</Typography>
                </ListItem>
              </MuiLink>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  )
};

export default DetailSidebar;