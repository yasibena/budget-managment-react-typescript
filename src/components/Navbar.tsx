import { useState, ReactNode, ChangeEvent } from 'react';
import { MouseEvent } from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { AccountBalanceWallet, Logout, Person, Settings } from '@mui/icons-material';
import Brightness2Icon from '@mui/icons-material/Brightness2'
import { useSearchContext } from '../context/searchContext.tsx'

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    border: '2px solid #2f2b43',
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    background: '#1D1933',
    width: 40,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '40ch',
        },
    },
}));

interface MenuItemProps {
    title: string,
    icon: ReactNode,
}

const menuItems: MenuItemProps[] = [
    { title: 'Profile', icon: <Person sx={{ mr: 1, color: '#AD49E1' }} /> },
    { title: 'Wallet', icon: <AccountBalanceWallet sx={{ mr: 1, color: '#AD49E1' }} /> },
    { title: 'Setting', icon: <Settings sx={{ mr: 1, color: '#AD49E1' }} /> },
    { title: 'Log out', icon: <Logout sx={{ mr: 1, color: '#AD49E1' }} /> },
]

export default function Navbar() {
    const { state, setSearchItem, setSearchResult } = useSearchContext()
    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchItem(e.target.value);

    };
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
        useState<null | HTMLElement>(null);
    const isMenuOpen = Boolean(anchorEl);

    const renderMenuItems = (title: string, icon: ReactNode) => (
        <MenuItem onClick={handleMenuClose}
            sx={{
                my: 1,
                ":hover": {
                    bgcolor: '#7A1CAC',

                }
            }}>
            {icon}
            <Typography
                sx={{
                    color: '#EBD3F8',
                    ":hover": {
                        color: 'white'
                    }

                }}>
                {title}
            </Typography>
        </MenuItem>
    );


    const handleProfileMenuOpen = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
            sx={{
                '& .MuiPaper-root': {
                    backgroundColor: '#1D1933',
                    minWidth: '240px',
                    mt: 5
                }
            }}
        >
            {menuItems.map((item) => (
                renderMenuItems(item.title, item.icon)
            ))}
        </Menu>
    );

    return (
        <Box sx={{ flexGrow: 1, marginTop: 2 }}>
            <AppBar position="static"
                sx={{
                    bgcolor: 'transparent',
                    boxShadow: 'none'
                }}>
                <Toolbar
                    sx={{ padding: '0 !important' }}
                >
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' } }}
                    >
                    </Typography>
                    <Search >
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                            value={state.searchTerm}
                            onChange={handleSearchChange}
                        />
                    </Search>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: 'flex' }}>
                        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                            <Badge>
                                <Brightness2Icon />
                            </Badge>
                        </IconButton>
                        <IconButton
                            size="large"
                            aria-label="show 17 new notifications"
                            color="inherit"
                        >
                            <Badge badgeContent={12} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMenu}
        </Box>
    );
}
