import React, { Suspense } from "react";
import CustomerGrid from "./CustomerGrid";
import Spinner from "@/components/Spinner";
import Navbar from "@/components/navbar/Navbar";
import BottomNavbar from "@/components/bottomNavbar/BottomNavbar";
import BreadCrumbs from "./BreadCrumbs";


export default async function DataGridPage() {


    return (
        <div className="container">
            <Navbar />
            <h1 className="text-2xl font-bold dark:text-blue-200 mt-4 ">CUSTOMERS</h1>
            <BreadCrumbs />
            <Suspense fallback={<Spinner />}>
                {/* <CustomerGrid /> */}
            </Suspense>
            <BottomNavbar />
        </div>
    )
}


