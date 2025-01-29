import React from 'react'
import { IoIosArrowBack } from "react-icons/io";

const Back = () => {
    return (
        <li>
            <div className="flex items-center">
                <a  href="/homepage" className="flex items-center ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-blue-200 dark:hover:text-white">
                    <IoIosArrowBack className="homeIcon dark:text-blue-200  group-hover:text-gray-600 dark:group-hover:text-blue-500" size='1rem' />
                    <span className='ml-1'>Back</span>
                </a>
            </div>
        </li>
    )
}

export default Back