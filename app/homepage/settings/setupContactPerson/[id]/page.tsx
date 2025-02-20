
import { getRolesAndDealerships, getUserById } from "@/lib/actions";
import SetupContactUserForm from "./SetupContactUserForm";
import { PageProps } from "@/.next/types/app/homepage/settings/setupContactPerson/[id]/page";


interface SetupContactPersonProps extends PageProps {
    params: Awaited<PageProps['params']>;
}

const SetupContactPersonPage = async ( { params }: SetupContactPersonProps ) => {

    const userId = await params;

    // get user by id
    const {user, error: userError} = await getUserById(userId.id);

    // get dealerships
    const { dealerships, error: rolesError } = await getRolesAndDealerships();

    return (
        <div>
            <SetupContactUserForm user={user} dealerships={dealerships} error={userError || rolesError} />
        </div>
    )
}

export default SetupContactPersonPage
