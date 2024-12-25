'use client'

import Link from "next/link"
import logo from "@/public/BG_logo4.png"
// import { Button } from "../ui/button"
import Image from "next/image"
// import { Menu, MenuItem } from "@mui/material"
import { useState } from "react"
// import { toast } from "react-toastify"

// const Logo = ({ isAdmin, error }: { isAdmin?: boolean, error?: string }) => {
const Logo = () => {

    // if (error) {
    //     toast.error(error)
    //     return null
    // }

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        // <Button asChild variant={"ghost"} size={null}>
            <div>
                {/* <Image src={logo} priority={true} alt="logo" width={38} className="rounded-full" onClick={handleClick} /> */}
                <Image src={logo} priority={true} alt="logo" width={70}  />

                {/* <Menu
                    id="demo-positioned-menu"
                    aria-labelledby="demo-positioned-button"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                >
                    {isAdmin
                        ?
                        (<div>
                            <MenuItem onClick={handleClose} >
                                <Link href="/">Home</Link>
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                                <Link href="/customers">Customers List</Link>
                            </MenuItem>
                            <MenuItem onClick={handleClose} >
                                <Link href="/customers/topCustomers/">Top 25 Customers</Link>
                            </MenuItem>
                        </div>)
                        :
                        (<MenuItem onClick={handleClose} >
                            <Link href="/">Home</Link>
                        </MenuItem>)
                    }
                </Menu> */}
            </div>
        // </Button>
    )
}

export default Logo
