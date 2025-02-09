'use client'

import { BottomNavigation, Paper, } from "@mui/material";
import { BottomNavigationActionStyled } from "./BottomNavigator.style";
import { redirect } from "next/navigation";
import { navbarLinks } from "./BottomNavBarLinks";

const BottomNavigaton = () => {

    return (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={5}>
            <BottomNavigation
                showLabels
            >
                {navbarLinks.map((link) => (
                    <BottomNavigationActionStyled
                        key={link.id}
                        onClick={link.onClick}
                        label={link.label}
                        icon={link.icon}
                        sx={link.sx}
                    />
                ))}
            </BottomNavigation>
        </Paper>
    )
}

export default BottomNavigaton
