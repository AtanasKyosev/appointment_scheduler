import {Outlet, Link} from "react-router-dom";

function Layout() {

    return (
        <>
            <nav>
                <Link to="/">
                    <img src={"/images/barber.png"} alt="logo"/>
                </Link>

                <ul>
                    <li>
                        <Link className="link" to="/book">Book</Link>
                    </li>
                    <li>
                        <Link className="link" to="/services">Services</Link>
                    </li>

                    <li>
                        <Link className="link" to="/login">Profile</Link>
                    </li>

                </ul>
            </nav>

            <Outlet/>

            <footer>
                <p>Barbershop AK &copy; All Rights Reserved </p>
            </footer>
        </>
    )
};

export default Layout;