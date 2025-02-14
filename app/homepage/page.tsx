
import { getProtectionPlanList } from '@/lib/actions'
import { auth } from '@clerk/nextjs/server'
import ProtectionPlanGrid from './ProtectionPlanGrid'

const page = async () => {

  // Get the logged in user's clerk ID
  const { userId } = await auth()

  // Get all customer vehicles by dealership id
  // Not yet used. Just in case this is needed
  // const { vehicles, error } = await getCustomerVehicles(userId as string) as { vehicles: ExtendedCustomerVehicle[], error: string };

  // Get protection Plan list
  const { plans, error: protectionPlanError } = await getProtectionPlanList()

  return (
    <div className='container pt-2' suppressHydrationWarning >
      <div className="items-center mt-4 font-bold text-gray-800">
        Customer Vehicle Protection Plan
      </div>
      <ProtectionPlanGrid plans={plans ?? []} error={protectionPlanError ?? ''} />
    </div>
  )
}
export default page
