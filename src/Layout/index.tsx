import { Sidebar } from "../components/Sidebar";
import { Box, useMediaQuery, Theme, Grid2 } from "@mui/material"
import { ReactNode } from "react";
import { styled } from "@mui/system";
import Navbar from "../components/Navbar";

interface LayoutProps {
    children: ReactNode
}

const ScrollBox = styled(Box)({
    width: "100%",
    overflowY: "auto",
    overflowX: "hidden",

    '&::-webkit-scrollbar': {
        width: '8px',
    },
    '&::-webkit-scrollbar-thumb': {
        background: '#888',
        borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
        background: '#555',
    },
});

export const Layout = ({ children }: LayoutProps) => {
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    return (
        <Box
            sx={{
                bgcolor: '#131129',
                display: 'flex',
                flexDirection: {
                    xs: 'column',
                    lg: 'row'
                },
                p: 0,
                m: 0,
                overflow: 'hidden',
                ml: isSmallScreen ? '' : 10
            }}
        >
            <ScrollBox>
                <Box sx={{ mx: isSmallScreen ? 5 : 10 }}>
                    <Navbar />
                </Box>
                <Sidebar />
                <Grid2
                    sx={{
                        mx: isSmallScreen ? 5 : 10,
                    }}>
                    {children}
                </Grid2>
            </ScrollBox>
        </Box>
    )
}
