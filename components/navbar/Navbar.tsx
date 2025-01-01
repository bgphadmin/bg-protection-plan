
import Container from "../global/Container"
import Logo from "./Logo"
import Profile from "./Profile"
import { isAdmin, isAdminMainDealership } from "@/lib/actions"

const Navbar = async () => {
    const { isUserAdmin } = await isAdmin();
    const { isUserAdminMainDealership } = await isAdminMainDealership()

    return (
        <nav className="border-b" >
            <Container className=" flex flex-row sm:place-content-between justify-between pb-2 pt-4 ">
                <Logo isAdmin={isUserAdmin} isAdminMainDealership={isUserAdminMainDealership} />
                <Profile />
            </Container>
        </nav>
    )
}

export default Navbar
