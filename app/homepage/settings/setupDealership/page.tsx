import { getDealershipsList } from "@/lib/actions";
import DealershiprGrid from "./DealershipGrid";


const DealershipPage = async () => {

    // Get all dealerships from Dealership table
    const { dealerships, error } = await getDealershipsList();

    return (
        <div className="container" suppressHydrationWarning>
            <DealershiprGrid dealerships={dealerships} error={error} />
        </div>
    )
}

export default DealershipPage
