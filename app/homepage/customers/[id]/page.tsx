import { PageProps } from "@/.next/types/app/homepage/customers/page";
import { getCustomerById, getRolesAndDealerships } from "@/lib/actions";
import UpdateCustomerForm from "./UpdateCustomerForm";


interface UpdateCustomerPageProps extends PageProps {
    params: Awaited<PageProps['params']>;
}

const UpdateCustomerPage = async ({ params }: UpdateCustomerPageProps) => {

    const customerId = await params;

    // get customer by id
    const { customer, error } = await getCustomerById(customerId.id);

    return (
        <div>
            {customer && (
                <UpdateCustomerForm customer={customer} error={error} />
            )}
        </div>
    )
}

export default UpdateCustomerPage
