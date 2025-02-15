
import React from "react";
import CustomerGrid from "./CustomerGrid";
import { getCustomersList } from "@/lib/actions";
import { currentUser } from "@clerk/nextjs/server";
import { ClerkLoaded } from "@clerk/nextjs";


export default async function DataGridPage() {

    // Get current users dealership id, argument for getCustomersList
    const user = await currentUser();

    // Get customers
    const { customers, error, isAdmin } = await getCustomersList(user?.id);

    return (
        <div className="container" suppressHydrationWarning>
            <div className="items-center mt-4 font-bold text-gray-800">
                Customers
            </div>
            <CustomerGrid customers={customers} error={error} isAdmin={isAdmin} />
        </div>
    )
}