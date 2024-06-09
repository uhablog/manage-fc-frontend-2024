'use client';
import { Box, Drawer, List, ListItem, ListItemIcon, Link as MuiLink, Typography } from "@mui/material";
import { AccountBox, Home, Info } from "@mui/icons-material";
import NextLink from "next/link";
import { useState } from "react";

const list_items = [
  {
    title: '大会一覧',
    icon: <Home/>,
    href: '/conventions'
  },
];

const bottom_items = [
  {
    title: 'ユーザー情報',
    icon: <AccountBox/>,
    href: '/user'
  }
]

const drawerWidth = 240;

function Sidebar() {

  const [isOpen, setIsOpen] = useState(false);

  const handleDrawerToggle = () => {
    setIsOpen(!isOpen);
  }

  return (
    <>
      {/* <IconButton onClick={handleDrawerToggle}>
        <Menu/>
      </IconButton> */}
      <Drawer 
        variant="permanent"
        anchor="left"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
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

export default Sidebar;