import React from 'react'
import { Typography, Tabs, Tab, Box, useMediaQuery } from '@mui/material';
import Tasks from './Tasks';
import Thoughts from './Thoughts';
import { useTheme } from '@mui/material';


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ padding: '10px 0px' }}>
                    {children}
                </Box>
            )}
        </div>
    );
}



function TabsComponent() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [value, setValue] = React.useState(0);

    const handleChange = (ev, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', height:"fit-content"}}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                {isMobile ?

                    <Tabs value={value} onChange={handleChange} textColor="primary" indicatorColor="primary" centered>
                        <Tab label={<Typography variant="h6">Tasks</Typography>} />
                        <Tab label={<Typography variant="h6">Thoughts of the Day</Typography>} />
                    </Tabs>

                    :

                    <Tabs value={value} onChange={handleChange} textColor="primary" indicatorColor="primary" variant="fullWidth">
                        <Tab label={<Typography variant="h6">Tasks</Typography>} />
                        <Tab label={<Typography variant="h6">Thoughts of the Day</Typography>} />
                    </Tabs>
                }
            </Box>
            <TabPanel value={value} index={0}>
                <Tasks mobile={isMobile} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Thoughts mobile={isMobile} />
            </TabPanel>
        </Box>
    )
}

export default TabsComponent;
