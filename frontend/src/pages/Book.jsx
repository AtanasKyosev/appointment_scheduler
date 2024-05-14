import {useEffect} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const Book = () => {

    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    // If you are in a session this will navigate you to home page

    useEffect(() => {
        axios.get('http://localhost:8081')
            .then(res => {
                if (res.data.valid) {
                    navigate('/book')
                } else {
                    navigate('/login')
                }
            })
            .catch(err => console.log(err))
    }, []);

    return (
        <>
            <div className="calendar-container">
                <h1>Book Here</h1>
            </div>
        </>
    )
};

export default Book;