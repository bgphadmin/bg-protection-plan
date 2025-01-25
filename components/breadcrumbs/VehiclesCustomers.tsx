import Link from 'next/link';
import React from 'react'
import { TbCarSuvFilled } from "react-icons/tb";

const VehiclesCustomer = ({id}: {id: string}) => {
    return (
        <li>
            <div className="flex items-center">
                <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                </svg>
                <Link href={`/homepage/customers/${id}/customerVehicles`} className="flex items-center ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-blue-200 dark:hover:text-white">
                    <TbCarSuvFilled className="homeIcon dark:text-blue-200  group-hover:text-gray-600 dark:group-hover:text-blue-500" size='1rem' />
                    <span className='ml-1'>Customers Vehicles</span>
                </Link>
            </div>
        </li>
    )
}

export default VehiclesCustomer