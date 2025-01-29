import Back from "@/components/breadcrumbs/Back"

const BreadCrumbs = () => {
    return (
        <div className="mb-4">
            <nav className="flex" aria-label="Breadcrumb">
                <ol className="inline-flex items-center itemsCenter space-x-1 md:space-x-2 rtl:space-x-reverse">
                    <Back />
                </ol>
            </nav>
        </div>
    )
}

export default BreadCrumbs