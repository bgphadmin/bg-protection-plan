// import { isAdmin } from "@/utils/actions";
import Container from "../global/Container"
import Logo from "./Logo"
import Profile from "./Profile"

const Navbar = async () => {
    // const { isRoleAdmin, error } = await isAdmin();
        return (
        <nav className="border-b" >
            <Container className="flex flex-row sm:place-content-between justify-between py-3 ">
                {/* <Logo isAdmin={isRoleAdmin} error={error} /> */}
                <Logo />
                <Profile />
            </Container>
        </nav>
    )
}

export default Navbar
