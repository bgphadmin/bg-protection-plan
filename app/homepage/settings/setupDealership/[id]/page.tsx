import { getDealershipById, isAdmin } from "@/lib/actions";
import UpdateDealershipForm from "./UpdateDealershipForm";
import { PageProps } from "@/.next/types/app/homepage/settings/setupDealership/[id]/page";


interface UpdateDealershipProps extends PageProps {
    params: Awaited<PageProps['params']>;
}

const UpdateDealershipPage = async ({ params }: UpdateDealershipProps) => {

    // check if user is admin
    const { error: adminError } = await isAdmin();

    const dealershipId = await params;

    // get dealership by id
    const { dealership, error: dealershipError } = await getDealershipById(parseInt(dealershipId.id));

    return (
        <div>
            <UpdateDealershipForm dealership={dealership ?? { name: '', id: 0, address1: '', address2: null, mobile: '', landline: null, contactPerson: null, enteredBy: null, createdAt: null, updatedAt: null }} dealershipError={dealershipError ?? ''} adminError={adminError ?? ''} />
        </div>
    )
}

export default UpdateDealershipPage