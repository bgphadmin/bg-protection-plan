'use client'

import Link from "next/link"
import logo from "@/public/BG_logo4.png"
import { Button } from "../ui/button"
import Image from "next/image"
import { Menu, MenuItem } from "@mui/material"
import { useEffect, useState } from "react"
import { NestedMenuItem } from "mui-nested-menu"
import { isAdmin, isAdminMainDealership } from "@/lib/actions"
// import { toast } from "react-toastify"

// const Logo = ({ isAdmin, error }: { isAdmin?: boolean, error?: string }) => {
const Logo = () => {

    // TODO: Add admin check here

    // if (error) {
    //     toast.error(error)
    //     return null
    // }

    const [isAdminMainDealershipAcess, setIsAdminMainDealershipAccess] = useState(false)
    const [isAdminAccess, setIsAdminAccess] = useState(false)

    useEffect(() => {
        // if role is not admin, redirect to homepage
        const checkAdminMainDealership = async () => {

            const { error: AdminMainDealershipAccessError } = await isAdminMainDealership()
            if (!AdminMainDealershipAccessError) {
                setIsAdminMainDealershipAccess(true)
            }
        }

        checkAdminMainDealership();
    }, []);

    useEffect(() => {
        // if role is not admin, redirect to homepage
        const checkAdmin = async () => {

            const { error: AdminError } = await isAdmin()
            if (!AdminError) {
                setIsAdminAccess(true)
            }
        }
        checkAdmin();
    }, []);



    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handlecustomersList = () => {
        location.href = "/homepage/customers"
    }

    const handleAddCustomer = () => {
        location.href = "/homepage/customers/addCustomer"
    }

    const handleSetupContactPerson = () => {
        location.href = "/homepage/settings/setupContactPerson"
    }

    const handleSetupDealership = () => {
        location.href = "/homepage/settings/setupDealership"
    }

    return (
        <Button asChild variant={"ghost"} size={null} className="logo">
            <div>
                <Image src={logo} priority={true} alt="logo" width={70} className="rounded-full" onClick={handleClick} />
                <Menu
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
                    {/* {isAdmin
                        ? */}
                    <div>
                        <MenuItem onClick={handleClose} >
                            <Link href="/homepage">Home</Link>
                        </MenuItem>

                        {isAdminMainDealershipAcess &&
                            <NestedMenuItem
                                label="Customers"
                                parentMenuOpen={open}
                            >
                                <MenuItem onClick={handlecustomersList} >
                                    Customers List
                                </MenuItem>
                                <MenuItem onClick={handleAddCustomer}>
                                    Add Customer
                                </MenuItem>
                            </NestedMenuItem>
                        }

                        {isAdminAccess &&
                            <NestedMenuItem
                                label="Settings"
                                parentMenuOpen={open}
                            >
                                <MenuItem onClick={handleSetupContactPerson} >
                                    Contact Person
                                </MenuItem>
                                <MenuItem onClick={handleSetupDealership}>
                                    Dealership
                                </MenuItem>
                            </NestedMenuItem>
                        }
                    </div>
                </Menu>
            </div>
        </Button>
    )
}

export default Logo
