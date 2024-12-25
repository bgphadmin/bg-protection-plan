'use client'

import Link from "next/link"
import { FaHome } from "react-icons/fa";
import { IoInformationCircle } from "react-icons/io5";
import { BiSolidWasher } from "react-icons/bi";
import { FaCar } from "react-icons/fa";
import { FaTruckMonster } from "react-icons/fa";
import { GiCarWheel } from "react-icons/gi";



interface NavbarLink {
    name: string;
    href: string;
    icon: React.ReactNode;
}

const navbarLinks: NavbarLink[] = [
    {
        name: "Engine Oil",
        href: "/eWalletPayment",
        icon: <FaCar className=" text-yellow-500 dark:text-blue-200  group-hover:text-gray-600 dark:group-hover:text-blue-500" size='2rem' />,
        // icon: <FaHome className="homeIcon dark:text-blue-200  group-hover:text-gray-600 dark:group-hover:text-blue-500" size='1.5rem' />,
    },
    {
        name: "MOA",
        href: "/points",
        icon: <FaTruckMonster className=" text-yellow-500 dark:text-blue-200 group-hover:text-gray-600 dark:group-hover:text-blue-500" size='2rem' />,
    },
    {
        name: "Automotive",
        href: "/about",
        icon: <GiCarWheel className="text-yellow-500 dark:text-blue-200 group-hover:text-gray-600 dark:group-hover:text-blue-500" size='2rem' />,
    },

];

const NavbarLinks = () => {
    return (
        <>
            {navbarLinks.map((link) => (
                <button type="button" className=" bottomNavbarButton dark:hover:bg-slate-800 hover:bg-gray-200 group " key={link.name}>
                    <Link href={link.href} className="flex flex-col items-center">
                        {link.icon}
                        <span className="bottomNavBarSpan dark:text-blue-200 group-hover:text-gray-600 dark:group-hover:text-blue-200">
                            {link.name}
                        </span>
                    </Link>
                </button>
            ))}
        </>
    )
}

export default NavbarLinks
