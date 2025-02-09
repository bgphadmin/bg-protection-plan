'use client'

import { SxProps, Theme } from "@mui/material";
import { redirect } from "next/navigation";
import { BiSolidCarGarage } from "react-icons/bi";
import { FaHome } from "react-icons/fa";
import { FaPersonCirclePlus } from "react-icons/fa6";
import { HiMiniClipboardDocumentList } from "react-icons/hi2";

interface NavbarLink {
    id: number;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    label: string;
    icon: React.ReactNode;
    sx?: SxProps<Theme>;
}

export const navbarLinks: NavbarLink[] = [
    {
        id: 1,
        onClick: () => { redirect('/homepage') },
        label: "Home",
        icon: <FaHome />,
        sx: { color: "maroon" }
    },
    {
        id: 2,
        onClick: () => { redirect('/homepage/customers/addCustomer') },
        label: "Add Customer",
        icon: <FaPersonCirclePlus />,
        sx: { color: "blue" }
    },
    {
        id: 3,
        onClick: () => { redirect('/homepage/customers/addVehicle') },
        label: "Add Vehicle",
        icon: <BiSolidCarGarage />,
        sx: { color: '#FFBF00' }
    },
    {
        id: 4,
        label: "Add Plan",
        onClick: () => { redirect('/homepage/customers/customerVehicles') },
        icon: <HiMiniClipboardDocumentList />,
        sx: { color: 'darkgreen' }
    }
];