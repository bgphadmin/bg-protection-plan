'use client'

import HeaderTitle from "@/components/HeaderTitle";
import { ClerkLoaded } from "@clerk/nextjs";
import { useRef, useState } from "react";
import { BiSolidCarGarage } from "react-icons/bi";
import BreadCrumbs from "../../../BreadCrumbs";
import { useRouter } from "next/navigation";
import products from "@/data/products.json"
import { toast } from "react-toastify";
import { addProtectionPlan } from "@/lib/actions";
import { FormControlLabel, Switch } from "@mui/material";

const AddProtectionPlanForm = ({ vehicleId }: { vehicleId: string }) => {

  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter();

  // add ProtectionPlan details
  const [productUsed, setProductUsed] = useState('');
  const [invoice, setInvoice] = useState('');
  const [serviceDate, setServiceDate] = useState('');
  const [odometer, setOdometer] = useState('');
  const [isApprovedOil, setIsApprovedOil] = useState(false);

  const handleGoBack = () => {
    router.back()
  };

  const clientAction = async (formData: FormData): Promise<void> => {
    
    let approvedOil = false
    
    const productUsed = formData.get('productUsed') as string;
    const invoice = formData.get('invoice') as string;
    const serviceDate = formData.get('serviceDate') as string;
    const odometer = formData.get('odometer') as string;
    const isApprovedOil = formData.get('isApprovedOil')?.toString() ;

    if (isApprovedOil === 'on') {
      approvedOil = true;
    } else {
      approvedOil = false;
    }

    // return
    if (!productUsed || !invoice || !serviceDate || !odometer) {
      toast.error('All fields are required')
    }

    const { error } = await addProtectionPlan(formData, vehicleId);

    if (error) {
      toast.error(error, { theme: "colored" });
    } else {
      toast.success('Protection plan added successfully', { theme: "colored" });
      formRef.current?.reset();
      handleGoBack();
    }
  };

  // TODO: ApprovedOil will show depending on the products used
  return (
    <div className="container">
      <ClerkLoaded>
        {/* TODO: Change Icon to Document */}
        <HeaderTitle Icon={BiSolidCarGarage} title="Add Protection Plan" />
        <section className="form">
          <BreadCrumbs />
          <form ref={formRef} action={clientAction} noValidate>
            <div className="form-group flex items-center">
              <label className="pr-2 w-1/4" htmlFor="productUsed">Product Used</label>
              <select
                id="productUsed"
                required
                className="form-control"
                value={productUsed}
                name="productUsed"
                onChange={(e) => setProductUsed(e.target.value)}
              >
                <option value="">Select Product Used</option>
                {products.map((product) => (
                  <option key={product.id} value={product.name}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group flex items-center">
              <label className="pr-2 w-1/4" htmlFor="invoice">Invoice</label>
              <input
                type="text"
                id="invoice"
                name="invoice"
                value={invoice}
                placeholder="Enter invoice here"
                onChange={(e) => setInvoice(e.target.value)} />
            </div>
            <div className="form-group flex items-center">
              <label className="pr-2 w-1/4" htmlFor="serviceDate">Service Date</label>
              <input
                type="date"
                id="serviceDate"
                name="serviceDate"
                value={serviceDate}
                onChange={(e) => setServiceDate(e.target.value)} />
            </div>
            <div className="form-group flex items-center">
              <label className="pr-2 w-1/4" htmlFor="odometer">Odometer</label>
              <input
                type="number"
                id="odometer"
                name="odometer"
                value={odometer}
                placeholder="Enter odometer reading here"
                onChange={(e) => setOdometer(e.target.value)} />
            </div>
            <div className="form-group flex items-center my-auto">
              <label className="pr-2 w-2/3" htmlFor="approvedOil">Approved OEM or BG729 or BG737 is used?</label>
              <Switch
                id="isApprovedOil"
                name="isApprovedOil"
                checked={isApprovedOil}
                onChange={(e) => setIsApprovedOil(e.target.checked)}
              />
            </div>

            <div className="form-group gap-4" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={handleGoBack} className="btn btn-block" style={{ backgroundColor: 'black', color: 'white', }} type="reset">
                Cancel
              </button>
              <button className="btn btn-block" type="submit">
                Submit
              </button>
            </div>
          </form>
        </section>
      </ClerkLoaded>
    </div>
  )
}

export default AddProtectionPlanForm
