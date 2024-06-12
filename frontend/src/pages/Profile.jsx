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
    const [appointments, setAppointments] = useState([]);

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

                    fetchAppointments(res.data.user.id);

                    navigate('/profile')
                } else {
                    navigate('/login')
                }
            })
            .catch(err => console.log(err))
    }, []);

    const fetchAppointments = (userId) => {
        axios.get('http://localhost:8081/profile', {
            params: { userId }
        })
            .then(response => {
                const filteredAppointments = response.data.filter(appointment => {
                    const appointmentDateTime = dayjs(`${appointment.date} ${appointment.time}`);
                    return appointmentDateTime.isAfter(dayjs());
                });
                setAppointments(filteredAppointments);
            })
            .catch(error => {
                console.error("There was an error fetching the appointments!", error);
            });
    };

    const handleSignOut = () => {
        axios.get('http://localhost:8081/logout')
            .then(() => {
                navigate('/');
            })
            .catch(err => console.log(err));
    };

    const handleDeleteProfile = () => {
        axios.delete('http://localhost:8081/delete-user', { id: id })
            .then(response => {
                console.log(response.data);
                navigate('/');
            })
            .catch(error => {
                console.error('Error deleting profile:', error);
            });
    };

    const handleDelete = (appointmentId) => {
        console.log("Deleting appointment ID:", appointmentId);
        axios.delete(`http://localhost:8081/appointments/${appointmentId}`)
            .then(response => {
                console.log("Appointment deleted successfully");
                fetchAppointments(id);
                navigate('/profile');
            })
            .catch(error => {
                console.error("There was an error deleting the appointment!", error);
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
                        <div className="appointments">
                            {appointments.length > 0 ? (
                                <table className="appointments-table">
                                    <thead>
                                    <tr>
                                        <th>Service</th>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Cancel</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {appointments.map(appointment => (
                                        <tr className="appointment-row" key={appointment.id}>
                                            <td>{appointment.service}</td>
                                            <td>{dayjs(appointment.date).format("DD-MM-YYYY")}</td>
                                            <td>{appointment.time.toString().slice(0, 5)}</td>
                                            <td>
                                                <button onClick={() => handleDelete(appointment.id)}>X</button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="no-appointments">No appointments.</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
};

export default Profile;
