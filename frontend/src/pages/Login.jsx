import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import Validation from "../validators/LoginValidator.jsx";
import axios from "axios";

function Login() {

    const navigate = useNavigate();

    // If you are in a session this will navigate you to home page

    useEffect(() => {
        axios.get('http://localhost:8081')
            .then(res => {
                if (res.data.valid) {
                    navigate('/profile')
                } else {
                    navigate('/login')
                }
            })
            .catch(err => console.log(err))
    }, []);

    // End of  comment

    const [values, setValues] = useState({
        username: '',
        password: '',
    })

    const [errors, setErrors] = useState({})

    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]: [event.target.value]}))
    }



    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors(Validation(values))
        if (errors.username === "" && errors.password === "") {
            axios.post('http://localhost:8081/login', values)
                .then(res => {
                    if (res.data.Login) {
                        console.log(res);
                        navigate('/')
                    } else {
                        alert("Wrong username/password! Try again!")
                    }

                })
                .catch(err => console.log(err));
        }

    }

    return (
        <>
            <div className="login-container">
                <div className="login-form">
                    <h1>Login</h1>
                    <form action="" onSubmit={handleSubmit}>
                        <label htmlFor="username">Username:</label>
                        <input
                            name="username"
                            type="text"
                            id="username"
                            placeholder="Enter your username..."
                            onChange={handleInput}
                        />
                        {errors.username && <span>{errors.username}</span>}

                        <label htmlFor="password">Password:</label>
                        <input
                            name="password"
                            type="password"
                            id="password"
                            placeholder="Enter your password..."
                            onChange={handleInput}
                        />
                        {errors.password && <span>{errors.password}</span>}

                        <button type="submit">
                            Login
                        </button>
                        <p>
                            Do not have an account? <Link to={"/signup"}>Sign up</Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;
