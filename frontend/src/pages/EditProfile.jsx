import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import Validation from "../validators/EditProfileValidator.jsx";

const EditProfile = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        id: "",
        first_name: "",
        last_name: "",
        username: ""
    });

    const [errors, setErrors] = useState({});

    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get('http://localhost:8081')
            .then(res => {
                if (res.data.valid) {
                    setFormData({
                        id: res.data.user.id,
                        first_name: res.data.user.first_name,
                        last_name: res.data.user.last_name,
                        username: res.data.user.username
                    });
                    navigate('/edit-profile');
                } else {
                    navigate('/login');
                }
            })
            .catch(err => console.error(err));
    }, []);

    const handleChange = e => {
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors(Validation(formData))
        if (errors.username === "" && errors.first_name === "" && errors.last_name === "") {
            axios.post('http://localhost:8081/update-profile', formData)
                .then(res => {
                    console.log(res.data);
                    alert("Note: Changes will take place after re-logging into your account!")
                    navigate('/profile');
                })
                .catch(err => {
                    console.error(err);
                });
        }
    };

    return (
        <>
            <div className="edit-container">
                <h1>Edit Profile</h1>
                <div className="edit-form">
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username">Username:</label>
                        <input type="text" id="username" name="username" value={formData.username}
                               onChange={handleChange}/>
                        {errors.username && <span>{errors.username}</span>}

                        <label htmlFor="first_name">First Name:</label>
                        <input type="text" id="first_name" name="first_name" value={formData.first_name}
                               onChange={handleChange}/>
                        {errors.first_name && <span>{errors.first_name}</span>}

                        <label htmlFor="last_name">Last Name:</label>
                        <input type="text" id="last_name" name="last_name" value={formData.last_name}
                               onChange={handleChange}/>
                        {errors.last_name && <span>{errors.last_name}</span>}

                        <input type="hidden" name="id" value={formData.id}/>

                        <button type="submit">Save</button>
                    </form>
                </div>
            </div>
        </>
    )
}
export default EditProfile;
