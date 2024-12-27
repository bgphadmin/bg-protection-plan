import React from 'react'
import { MdOutlineSettings } from "react-icons/md";

const Settings = () => {
    return (
        <li className="inline-flex items-center">
            <a href="/homepage" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-blue-200 dark:hover:text-white">
                <MdOutlineSettings className="mr-1.5 dark:text-blue-200  group-hover:text-gray-600 dark:group-hover:text-blue-500" size='1rem' />
                Settings
            </a>
        </li>
    )
}

export default Settings
