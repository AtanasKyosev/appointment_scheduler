import axios from "axios";
import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import dayjs from 'dayjs';

const Profile = () => {

    const navigate = useNavigate();

    const [id, setUserId] = useState("");
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [created_at, setCreatedAt] = useState("")

    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get('http://localhost:8081')
            .then(res => {
                if (res.data.valid) {
                    setUserId(res.data.user.id);
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

    const handleSignOut = () => {
        axios.get('http://localhost:8081/logout')
            .then(() => {
                navigate('/');
            })
            .catch(err => console.log(err));
    };

    const handleDeleteProfile = () => {
        axios.post('http://localhost:8081/delete-user', { id: id })
            .then(response => {
                console.log(response.data);
                // Redirect to login page or perform any other action
                navigate('/');
            })
            .catch(error => {
                console.error('Error deleting profile:', error);
            });
    };

    return (
        <>
            <div className="profile-container">
                <h1>Profile Details</h1>
                <div className="profile-information">

                    <div className="profile-nav">
                        <h2>@{username}</h2>
                        <div>
                            <Link to="/edit-profile" className="btn btn-edit">Edit</Link>
                            <button onClick={handleDeleteProfile} className="btn btn-delete">Delete</button>
                        </div>
                    </div>

                    <h3>{first_name} {last_name}</h3>
                    <div className="profile-footer">
                        <p>Profile created on: {created_at}</p>
                        <button onClick={handleSignOut}>Sign Out</button>
                    </div>

                    <div className="profile-appointments">
                        <h2>My Appointments</h2>
                    </div>
                </div>
            </div>
        </>
    )
};

export default Profile;