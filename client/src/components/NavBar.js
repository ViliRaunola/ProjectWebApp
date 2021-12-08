import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import { Link as RouterLink} from 'react-router-dom';


//SOURCE FOR APP BAR: https://mui.com/components/app-bar/#basic-app-bar


const ResponsiveAppBar = () => {

    // These useStates and functions are used to handle the closing and opening of the drop down menus

    const [anchorElNav, setAnchorElNav] = React.useState(null);
    
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };


    return (
        <AppBar position="static">
        <Container maxWidth="xl" >  {/* Container now grows to the full size of the screen */}
            <Toolbar disableGutters> {/* Gutters are set to false, so there wont be spaces between content's tracks*/}
            {/* Name of the site and setting the first box to have flexgrow 1 so all the other components that come after it are on the right side*/}
            <Box display='flex' flexGrow='1'>
                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{ mr: 4}}
                >
                    STACK UNDERFLOW
                </Typography>
            </Box>

                {/* Defining the area/ box in which the links to pages are located. 'xs: flex' meaning that on xs screens the menu is shown and in others 'md: none' it is hidden*/}
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                {/* The haburger menu that is displayed on mobile */}
                <IconButton
                size="small"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
                >
                <MenuIcon />
                </IconButton>
                <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                    display: { xs: 'block', md: 'none' },
                }}
                >
                    {/* Looping through the items that are specified to be pages in burger*/}
                <MenuItem 
                    component={RouterLink} 
                    to='/' 
                    color="inherit" 
                    style={{padding: '10px'}}>
                        Home
                </MenuItem>
                <MenuItem 
                    component={RouterLink} 
                    to='/posts' 
                    color="inherit" 
                    style={{padding: '10px'}}>
                        Posts
                </MenuItem>
                <MenuItem 
                    component={RouterLink} 
                    to='/profile' 
                    color="inherit" 
                    style={{padding: '10px'}}>
                        Profile
                </MenuItem>
                </Menu>
            </Box>
            {/* Creating links to pages. Are shown in the desktop mode due to md beign flex and xs none meaning on extra small screens this is hidden*/}
            <Box  sx={{ display: { xs: 'none', md: 'flex' } }}>
                <MenuItem 
                    component={RouterLink} 
                    to='/' 
                    color="inherit" 
                    style={{padding: '10px'}}>
                        Home
                </MenuItem>
                <MenuItem 
                    component={RouterLink} 
                    to='/posts' 
                    color="inherit" 
                    style={{padding: '10px'}}>
                        Posts
                </MenuItem>
                <MenuItem 
                    component={RouterLink} 
                    to='/profile' 
                    color="inherit" 
                    style={{padding: '10px'}}>
                        Profile
                </MenuItem>
            </Box>
            </Toolbar>
        </Container>
        </AppBar>
    );
    };
export default ResponsiveAppBar;
