
import { getProtectionPlanList } from '@/lib/actions'
// import HomePage from './HomePage'
import { ClerkLoaded } from '@clerk/nextjs'
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
    <ClerkLoaded>
      <div className='container' suppressHydrationWarning>
        <ProtectionPlanGrid plans={plans ?? []} error={protectionPlanError ?? ''} />
      </div>
    </ClerkLoaded>
  )
}
export default page
