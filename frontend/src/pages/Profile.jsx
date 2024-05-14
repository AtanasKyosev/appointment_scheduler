import axios from "axios";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import dayjs from 'dayjs';

const Profile = () => {

    const navigate = useNavigate();

    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [created_at, setCreatedAt] = useState("")

    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get('http://localhost:8081')
            .then(res => {
                if (res.data.valid) {
                    setFirstName(res.data.user.first_name);
                    setLastName(res.data.user.last_name);
                    setUsername(res.data.user.username);
                    const formattedDate = dayjs(res.data.user.created_at).format("DD-MM-YYYY");
                    setCreatedAt(formattedDate);
                    navigate('/profile')
                } else {
                    navigate('/login')
                }
            })
            .catch(err => console.log(err))
    }, []);

    return (
        <>
            <div className="profile-container">
                <h1>Profile Details</h1>
                <div className="profile-information">

                    <div className="profile-nav">
                        <h2>@{username}</h2>
                        <div>
                            <button className="btn btn-edit">Edit</button>
                            <button className="btn btn-delete">Delete</button>
                        </div>
                    </div>

                    <h3>{first_name} {last_name}</h3>
                    <h4>Profile created at: {created_at}</h4>

                    <div className="profile-appointments">
                        <h2>My Appointments</h2>
                    </div>
                </div>
            </div>
        </>
    )
};

export default Profile;