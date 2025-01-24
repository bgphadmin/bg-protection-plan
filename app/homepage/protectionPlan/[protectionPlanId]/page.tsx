'use server'

import { PageProps } from "@/.next/types/app/homepage/protectionPlan/[protectionPlanId]/page";
import { ExtendedProtectionPlan, getProtectionPlanById } from "@/lib/actions";
import { ClerkLoaded } from "@clerk/nextjs";
import { toast } from "react-toastify";
import ViewProtectionPlanDetails from "./ViewProtectionPlanDetails";

interface ViewProtectionPlanPageProps extends PageProps {
    params: Awaited<PageProps['params']>;
}

const ViewProtectionPlanPage = async ({ params }: ViewProtectionPlanPageProps) => {

    const protectionPlanIdParams = await params
    const planId = await protectionPlanIdParams.protectionPlanId;
    const { plan: protectionPlan, error } = await getProtectionPlanById(planId);

    return (
        <ClerkLoaded>
            <ViewProtectionPlanDetails protectionPlan={protectionPlan as ExtendedProtectionPlan} error={error} />
        </ClerkLoaded>
    )
}

export default ViewProtectionPlanPage
