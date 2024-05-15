import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import Validation from "../validators/SignUpValidator.jsx";
import axios from "axios";

function SignUp() {

    const navigate = useNavigate();

    // If you are in a session this will navigate you to home page

    useEffect(() => {
        axios.get('http://localhost:8081')
            .then(res => {
                if (res.data.valid) {
                    navigate('/profile')
                } else {
                    navigate('/signup')
                }
            })
            .catch(err => console.log(err))
    }, []);

    // End of  comment

    const [values, setValues] = useState({
        first_name: '',
        last_name: '',
        username: '',
        password: '',
    })

    const [errors, setErrors] = useState({})

    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]: [event.target.value]}))
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrors(Validation(values))
        if (errors.first_name.length === 0 &&
            errors.last_name.length === 0 &&
            errors.username.length === 0 &&
            errors.password.length === 0) {
            axios.post('http://localhost:8081/signup', values)
                .then(res => {
                    navigate('/')
                    console.log(res)
                })
                .catch(err => console.log(err));
        }
    }

    return (
        <>
            <div className="sign-up-container">
                <div className="sign-up-form">
                    <h1>Sign Up</h1>
                    <form action="" onSubmit={handleSubmit}>
                        <label>First Name:</label>
                        <input
                            type="text"
                            placeholder="Enter your first name..."
                            name="first_name"
                            onChange={handleInput}
                        />
                        {errors.first_name && <span>{errors.first_name}</span>}

                        <label>Last Name:</label>
                        <input
                            type="text"
                            placeholder="Enter your last name..."
                            name="last_name"
                            onChange={handleInput}
                        />
                        {errors.last_name && <span>{errors.last_name}</span>}

                        <label>Username:</label>
                        <input
                            type="text"
                            placeholder="Enter your username..."
                            name="username"
                            onChange={handleInput}
                        />
                        {errors.username && errors.username.map((error, index) => (
                            <span key={index} className="error">{error}</span>
                        ))}

                        <label>Password:</label>
                        <input
                            type="password"
                            placeholder="Enter your password..."
                            name="password"
                            onChange={handleInput}
                        />
                        {errors.password && errors.password.map((error, index) => (
                            <span key={index} className="error">{error}</span>
                        ))}

                        <button type="submit">
                            Sign Up
                        </button>
                        <p>
                            Already have an account? <Link to={"/login"}>Login</Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}

export default SignUp;