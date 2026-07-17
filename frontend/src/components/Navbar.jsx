import { Link, useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    function logout() {

        localStorage.removeItem("token");
        navigate("/login");

    }

    return (

        <nav>

            <div className="logo">
                <Link to="/">Cogniva</Link>
            </div>

            <div className="nav-links">

                <Link to="/">Home</Link>

                {
                    token ?

                    <>
                        <Link to="/dashboard">Dashboard</Link>

                        <Link to="/documents">Documents</Link>

                        <button onClick={logout}>
                            Logout
                        </button>
                    </>

                    :

                    <>
                        <Link to="/login">Login</Link>

                        <Link to="/register">Register</Link>
                    </>
                }

            </div>

        </nav>

    );

}

export default Navbar;