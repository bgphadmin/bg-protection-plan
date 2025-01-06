import ContactUser from "@/components/breadcrumbs/ContactUser"
import Dealership from "@/components/breadcrumbs/Dealership"
import Dealerships from "@/components/breadcrumbs/Dealerships"
import Settings from "@/components/breadcrumbs/Settings"


const BreadCrumbs = () => {
    return (
        <div className="mb-4">
            <nav className="flex" aria-label="Breadcrumb">
                <ol className="inline-flex items-center itemsCenter space-x-1 md:space-x-2 rtl:space-x-reverse">
                    <Settings />
                    <Dealerships />
                </ol>
            </nav>
        </div>
    )
}

export default BreadCrumbs





