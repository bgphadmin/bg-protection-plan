import Customers from "@/components/breadcrumbs/Customers"
import EditCustomer from "@/components/breadcrumbs/EditCustomer"
import Home from "@/components/breadcrumbs/Home"



const BreadCrumbs = () => {
    return (
        <div className="mb-4">
            <nav className="flex" aria-label="Breadcrumb">
                <ol className="inline-flex items-center itemsCenter space-x-1 md:space-x-2 rtl:space-x-reverse">
                    <Home />
                    <Customers />
                    <EditCustomer />
                </ol>
            </nav>
        </div>
    )
}

export default BreadCrumbs





