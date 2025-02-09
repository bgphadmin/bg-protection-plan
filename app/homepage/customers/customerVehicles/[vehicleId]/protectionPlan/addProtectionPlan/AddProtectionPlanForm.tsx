'use client'

import HeaderTitle from "@/components/HeaderTitle";
import { ClerkLoaded } from "@clerk/nextjs";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import products from "@/data/products.json"
import { toast } from "react-toastify";
import { addProtectionPlan } from "@/lib/actions";
import { Switch } from "@mui/material";
import Image from "next/image";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { storage } from "@/firebase";
import BreadCrumbs from "./BreadCrumbs";
import { IoDocumentTextOutline } from "react-icons/io5";

const AddProtectionPlanForm = ({ vehicleId }: { vehicleId: string }) => {

  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter();

  // add ProtectionPlan details
  const [productUsed, setProductUsed] = useState('');
  const [invoice, setInvoice] = useState('');
  const [serviceDate, setServiceDate] = useState('');
  const [odometer, setOdometer] = useState('');
  const [isApprovedOil, setIsApprovedOil] = useState(false);

  const pickerRef = useRef<any>(null);
  const [pickedImage, setPickedImage] = useState<any>("");
  const [invoiceUrl, setInvoiceUrl] = useState<any>("");

  // Create a storage reference from our storage service
  const storageRef = ref(storage, "invoices/" + invoice);



  const handleGoBack = () => {
    router.back()
  };

  const clientAction = async (formData: FormData): Promise<void> => {

    const invoiceUrl = await uploadFileToFB();

    let approvedOil = false

    const productUsed = formData.get('productUsed') as string;
    const invoice = formData.get('invoice') as string;
    const serviceDate = formData.get('serviceDate') as string;
    const odometer = formData.get('odometer') as string;
    const isApprovedOil = formData.get('isApprovedOil')?.toString();


    if (isApprovedOil === 'on') {
      approvedOil = true;
    } else {
      approvedOil = false;
    }

    // return
    if (!productUsed || !invoice || !serviceDate || !odometer) {
      toast.error('All fields are required')
    }

    if (!invoiceUrl) {
      toast.error('Invoice Image is required')
      return 
    }

    const { error } = await addProtectionPlan(formData, vehicleId, invoiceUrl);

    if (error) {
      toast.error(error, { theme: "colored" });
    } else {
      toast.success('Protection plan added successfully', { theme: "colored" });
      formRef.current?.reset();
      router.push(`/homepage/customers/customerVehicles/${vehicleId}/viewVehicle`);
    }
  };

  const selectImage = (e: any) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent: any) => {
      setPickedImage(readerEvent.target.result);
    };
  };


  const uploadFileToFB = async (): Promise<any> => {
    // setLoading(true)
    try {
      if (pickedImage) {
        await uploadString(storageRef, pickedImage, 'data_url')
        const url = await getDownloadURL(storageRef)
        setInvoiceUrl(url)
        return url
      }
    } catch (error) {
      toast.error("Something went wrong while uploading image");
    }
    // setLoading(false)
  }


  // TODO: ApprovedOil will show depending on the products used
  return (
    <div className="container">
      <ClerkLoaded>
        <HeaderTitle Icon={IoDocumentTextOutline} title="Add Protection Plan" />
        <section className="form">
          <BreadCrumbs vehicleId={vehicleId} />
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
            {/* <div className="form-group flex items-center my-auto">
              <label className="pr-2 w-2/3" htmlFor="approvedOil">Approved OEM or BG729 or BG737 is used?</label>
              <Switch
                id="isApprovedOil"
                name="isApprovedOil"
                checked={isApprovedOil}
                onChange={(e) => setIsApprovedOil(e.target.checked)}
              />
            </div> */}

            <div
              onClick={() => pickerRef.current.click()}
              className="relative h-[10rem] w-[10rem] border cursor-pointer flex flex-col items-center justify-center overflow-hidden rounded-lg "
            >
              {pickedImage ? (
                <Image src={pickedImage} fill style={{ objectFit: "cover" }} alt="" />
              ) : (
                <p>Select Invoice</p>
              )}
            </div>

            <input
              ref={pickerRef}
              onChange={(e) => selectImage(e)}
              type="file"
              accept=".png, .jpg, .jpeg"
              hidden
            />

            <div className="form-group gap-4" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem'}}>
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
