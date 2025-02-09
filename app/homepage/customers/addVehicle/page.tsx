
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
        <ClerkLoaded>
            <div className="container" suppressHydrationWarning>
                <CustomerGrid customers={customers} error={error} isAdmin={isAdmin} />
            </div>
        </ClerkLoaded>
    )
}