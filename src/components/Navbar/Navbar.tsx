import { Link } from "react-router-dom"
import "./Navbar.css"
import { Avatar, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react"
import { useSelector } from "react-redux";
import { RootState } from "../../store/reducer/reducer";

export const Navbar = () => {
    const userInfo = useSelector((state: RootState) => state.user.userInfo?.data);

    return (
        <header className="navbar">
            <div className="navbar__logo__container">
                <Link to="/" className="navbar_logo">CarrierCrafter</Link>
            </div>
            <nav className="navbar__links__container">
                <Link to="/book-carriers">Carriers Cart</Link>
                <Menu>
                    <MenuButton>
                        <div className="user__menu">
                            <Avatar name={userInfo?.user_name ?? ""} src={userInfo?.user_image ?? ""} />
                        </div>
                    </MenuButton>
                    <MenuList>
                        <MenuItem>
                            <Link to="/my-bookings">My Bookings</Link>
                        </MenuItem>
                        {/* <MenuItem onClick={() => dispatch(logout())}>Logout</MenuItem> */}
                    </MenuList>
                </Menu>

            </nav>
        </header>
    )
}
