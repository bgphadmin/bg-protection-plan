import Home from "@/components/breadcrumbs/Home"
import Users from "@/components/breadcrumbs/Users"

const BreadCrumbs = () => {
    return (
        <div className="mb-4">
            <nav className="flex" aria-label="Breadcrumb">
                <ol className="inline-flex items-center itemsCenter space-x-1 md:space-x-2 rtl:space-x-reverse">
                    <Home />
                    <Users />
                </ol>
            </nav>
        </div>
    )
}

export default BreadCrumbs





