
import { Box, Drawer, useMediaQuery, Theme, List, Tooltip, ListItem } from "@mui/material"
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PersonIcon from '@mui/icons-material/Person';
import BarChartIcon from '@mui/icons-material/BarChart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Settings } from "@mui/icons-material";

interface TooltipItemProps {
  title: string;
  icon: ReactNode;
  link: string;
}

const tooltipItems: TooltipItemProps[] = [
  { title: 'Dashboard', icon: <DashboardIcon fontSize="large" sx={{ cursor: 'pointer', color: '#EBD3F8' }} />, link: '/dashboard' },
  { title: 'Wallet', icon: <AccountBalanceWalletIcon fontSize="large" sx={{ cursor: 'pointer', color: '#EBD3F8' }} />, link: '/dashboard/wallet' },
  { title: 'Budget', icon: <MonetizationOnIcon fontSize="large" sx={{ cursor: 'pointer', color: '#EBD3F8' }} />, link: '/dashboard/budget' },
  { title: 'Goals', icon: <CheckCircleIcon fontSize="large" sx={{ cursor: 'pointer', color: '#EBD3F8' }} />, link: '/dashboard/goals' },
  { title: 'User', icon: <PersonIcon fontSize="large" sx={{ cursor: 'pointer', color: '#EBD3F8' }} />, link: '/dashboard' },
  { title: 'Analyst', icon: <BarChartIcon fontSize="large" sx={{ cursor: 'pointer', color: '#EBD3F8' }} />, link: '/dashboard/Analyst' },
  { title: 'Setting', icon: <Settings fontSize="large" sx={{ cursor: 'pointer', color: '#EBD3F8' }} />, link: '/dashboard' },
];

export const Sidebar = () => {
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  const renderTooltipItem = (title: string, icon: ReactNode, link: string) => (
    <Tooltip
      title={title}
      placement={isSmallScreen ? "top-start" :"right"}
      slotProps={{
        popper: {
          modifiers: [
            {
              name: 'offset',
              options: { offset: isSmallScreen ? [5, -20] : [0, -34] },
            },
          ],
        },
      }}
      PopperProps={{
        sx: {
          '& .MuiTooltip-tooltip': {
            color: '#7A1CAC',
            bgcolor: 'white',
            borderRadius: '4px',
            padding: '8px',
            fontWeight: 'bold'
          },
        },
      }}
    >
      <Link to={link}>
        <ListItem
          sx={{
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'center',
            marginTop: isSmallScreen ? '' : 4
          }}>
          {icon}
        </ListItem>
      </Link>
    </Tooltip>
  );

  return (
    <Box zIndex='999'>
      <Drawer
        variant="permanent"
        anchor="bottom"
        sx={{
          '& .MuiDrawer-paper': {
            width: isSmallScreen ? '100%' : 80,
            height: isSmallScreen ? 80 : '100vh',
            bgcolor: '#7A1CAC',
            overflow:'hidden'
          },
        }}
      >
        <List
          sx={{
            display: isSmallScreen ? 'flex' : '',
            justifyContent: isSmallScreen ? 'center' : '',
            alignItems: isSmallScreen ? 'center' : '',
            marginTop:isSmallScreen ? '' : 5
          }}>
          {tooltipItems.map((item) => (
            <>
              {renderTooltipItem(item.title, item.icon, item.link)}
            </>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};
