import { getCustomerById, getRolesAndDealerships } from "@/lib/actions";
import UpdateCustomerForm from "./UpdateCustomerForm";
import { PageProps } from "@/.next/types/app/homepage/customers/[id]/page";



interface UpdateCustomerPageProps extends PageProps {
    params: Awaited<PageProps['params']>;
}

const UpdateCustomerPage = async ({ params }: UpdateCustomerPageProps) => {

    const customerId = await params;

    // get customer by id
    const { customer, error } = await getCustomerById(customerId.id);

    return (
        <div className="container">
            {customer && (
                <UpdateCustomerForm customer={customer} error={error} />
            )}
        </div>
    )
}

export default UpdateCustomerPage
