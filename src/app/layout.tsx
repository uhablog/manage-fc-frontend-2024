import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from "@/theme";
import Sidebar from "./component/Sidebar";
import { Box, CssBaseline, styled } from "@mui/material";
import MobileBottomNav from "./component/MobileBottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <UserProvider>
        <body className={inter.className}>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme} >
              <Box sx={{ display: "flex"}}>
                <CssBaseline/>
                <Sidebar/>
                <Box component='main' sx={{ flexGrow: 1, p: 3}} >
                  {children}
                </Box>
                <MobileBottomNav/>
              </Box>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </body>
      </UserProvider>
    </html>
  );
}
