import { useLocation, Location, Link } from "react-router-dom"
import { Box, Grid2, Typography, useMediaQuery, Theme } from "@mui/material"

interface HeadingProps {
    location: Location
}

export const Heading = ({ location }: HeadingProps) => {
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1] || 'No last segment';
    const changeFirstLetterUpperCase = (str: string) => {
        return str.charAt(0).toUpperCase() + lastSegment.slice(1)
    }

    return (
        <Grid2 container spacing={1} direction={isSmallScreen ? "column" : "row"} justifyContent='space-between' sx={{
            mt: 3,
        }} >
            <Box >
                <Typography variant="h6" component="h6" color="white" sx={{ fontWeight: 600, fontSize: '1.5rem' }}>
                    {changeFirstLetterUpperCase(lastSegment)}
                </Typography>
                <Typography variant="subtitle1" color="#EBD3F8" fontSize='0.8rem' fontWeight={600}>
                    Welcome Finance Management
                </Typography>

            </Box>
            <Box>
                <Typography variant="h6" component="h6" color="#EBD3F8" sx={{ fontSize: '.8rem',fontWeight:600 }} >
                    <Link to='/dashboard' style={{ textDecoration: 'none', color: 'inherit' }}>
                        Home
                    </Link>
                    <span style={{margin:6}}>
                        &gt;
                    </span>
                    <Link to={location} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {changeFirstLetterUpperCase(lastSegment)}
                    </Link>
                </Typography>
            </Box>
        </Grid2>
    )
}
