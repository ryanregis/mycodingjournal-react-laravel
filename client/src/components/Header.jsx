import React from 'react'
import { Typography, Box, createTheme, responsiveFontSizes, ThemeProvider } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({

    root: {
        width: '100%',
        backgroundColor: 'background.default',
    }

}));

let theme = createTheme();
theme = responsiveFontSizes(theme);


function Header() {
    const classes = useStyles();

    return (
        <Box className={classes.root}>
            <ThemeProvider theme={theme}>
                <Typography variant="h3" sx={{p:2}}>
                    My Coding Journal
                </Typography>
            </ThemeProvider>
        </Box>
    )
}

export default Header
