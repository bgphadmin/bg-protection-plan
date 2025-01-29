import { PageProps } from "@/.next/types/app/homepage/protectionPlan/[protectionPlanId]/updateProtectionPlan/page";
import { ExtendedProtectionPlan, getProtectionPlanById } from "@/lib/actions";
import UpdateProtectionPlanForm from "./UpdateProtectionPlanForm";

interface UpdateProtectionPlanPageProps extends PageProps {
    params: Awaited<PageProps['params']>;
}

const UpdateProtectionPlanPage = async ( { params }: UpdateProtectionPlanPageProps ) => {
  
  const protectionPlanIdParams = await params
  const planId = await protectionPlanIdParams.protectionPlanId

  // get protection plan by id
  const { plan, error } = await getProtectionPlanById(planId)
  
  return (
    <div>
      <UpdateProtectionPlanForm protectionPlan={plan as ExtendedProtectionPlan} error={error} />  
    </div>
  )
}

export default UpdateProtectionPlanPage