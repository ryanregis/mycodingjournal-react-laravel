import React from 'react'
import { Box, Typography } from '@mui/material'

const style = {
    width: '100%',
    position: 'sticky',
    bottom: 0,
    bgcolor: 'background.default',
    borderTop: 1,
    borderColor: 'divider',
}

function Footer() {
    return (
        <Box sx={style}>
            <Typography variant="subtitle2">
                Created and Designed by Ryan Gerome Regis &copy; 2021<br />
                Frontend: React&ensp;&ensp;&ensp;Backend: Laravel Server API
            </Typography>
        </Box>
    )
}

export default Footer
