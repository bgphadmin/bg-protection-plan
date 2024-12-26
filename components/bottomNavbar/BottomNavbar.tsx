'use client'

import { Suspense } from "react"
import NavbarLinks from "./NavbarLinks"

const BottomNavbar = () => {
    return (
        <Suspense fallback={<>Loading...</>}>
            <div className="bottomNavbar">
                <div className="bottomNavbarBorder flex flex-row items-center">
                    <NavbarLinks />
                    {/* <DarkMode /> */}
                </div>
            </div>
        </Suspense>
    )
}

export default BottomNavbar
