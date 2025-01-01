'use client'

import { ClerkLoaded } from "@clerk/nextjs"
import AddDealershipForm from "./AddDealershipForm"
import HeaderTitle from "@/components/HeaderTitle"
import { GiHomeGarage } from "react-icons/gi"


const SetupDealershipPage = () => {
  return (
    <div>
      <ClerkLoaded />
      <HeaderTitle Icon={GiHomeGarage} title="Add Dealership" />
      <AddDealershipForm />
    </div>
  )
}

export default SetupDealershipPage
