import React, { Suspense } from "react";
import CustomerGrid from "./CustomerGrid";
import Spinner from "@/components/Spinner";
import Navbar from "@/components/navbar/Navbar";
import BottomNavbar from "@/components/bottomNavbar/BottomNavbar";
import BreadCrumbs from "./BreadCrumbs";
import { getCustomersList } from "@/lib/actions";
import { currentUser } from "@clerk/nextjs/server";


export default async function DataGridPage() {

    // Get current users dealership id, argument for getCustomersList
    const user = await currentUser();

    // Get customers
    const { customers, error, isAdmin } = await getCustomersList(user?.id);

    return (
        <div className="container" suppressHydrationWarning>
            <Navbar />
            <h1 className="text-2xl font-bold dark:text-blue-200 mt-4 ">CUSTOMERS</h1>
            <BreadCrumbs />
            <Suspense fallback={<Spinner />}>
                <CustomerGrid customers={customers} error={error} isAdmin={isAdmin} />
            </Suspense>
            <BottomNavbar />
        </div>
    )
}


