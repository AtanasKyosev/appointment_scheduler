import {Link} from "react-router-dom";
import {useState} from "react";
import axios from "axios";

function Home() {
    const [name, setName] = useState();

    axios.defaults.withCredentials = true;

    axios.get('http://localhost:8081')
        .then(res => {
            if (res.data.valid) {
                setName(res.data.user.first_name)
            }
        })
        .catch(err => console.log(err))

    return (
        <>
            <div className="background-image">
                {name ? <h1>Welcome, {name}!</h1> : <h1>Welcome!</h1>}
                <p>Transform your look, book an appointment for your next haircut!</p>
                <Link className={"book-btn"} to="/book">Book Now!</Link>
            </div>
        </>
    )
}

export default Home;