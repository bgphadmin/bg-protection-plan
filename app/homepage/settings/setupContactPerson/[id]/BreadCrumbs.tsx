import ContactUser from "@/components/breadcrumbs/ContactUser"
import Settings from "@/components/breadcrumbs/Settings"
import Users from "@/components/breadcrumbs/Users"

const BreadCrumbs = () => {
    return (
        <div className="mb-4">
            <nav className="flex" aria-label="Breadcrumb">
                <ol className="inline-flex items-center itemsCenter space-x-1 md:space-x-2 rtl:space-x-reverse">
                    <Settings />
                    <Users />
                    <ContactUser />
                </ol>
            </nav>
        </div>
    )
}

export default BreadCrumbs





