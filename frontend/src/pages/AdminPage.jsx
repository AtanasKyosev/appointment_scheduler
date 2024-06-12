import React, { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import dayjs from 'dayjs';

function AdminPage() {
    const navigate = useNavigate();
    const [userId, setUserId] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [users, setUsers] = useState([]);

    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get('http://localhost:8081')
            .then(res => {
                if (res.data.valid && res.data.user.id === 1) {
                    setUserId(res.data.user.id);
                    fetchAppointments();
                } else {
                    navigate('/login');
                }
            })
            .catch(err => console.log(err));
    }, []);

    const fetchAppointments = () => {
        axios.get('http://localhost:8081/appointments')
            .then(res => {
                const allAppointments = res.data;
                const futureAppointments = allAppointments.filter(appointment => {
                    const appointmentDateTime = dayjs(`${appointment.date} ${appointment.time}`);
                    return appointmentDateTime.isAfter(dayjs());
                });
                setAppointments(futureAppointments);

                const pastAppointments = allAppointments.filter(appointment => {
                    const appointmentDateTime = dayjs(`${appointment.date} ${appointment.time}`);
                    return appointmentDateTime.isBefore(dayjs());
                });
                deletePastAppointments(pastAppointments);
            })
            .catch(err => console.log(err));

        axios.get('http://localhost:8081/users')
            .then(res => {
                setUsers(res.data);
            })
            .catch(err => console.log(err));

    };

    const deletePastAppointments = (appointmentsToDelete) => {
        appointmentsToDelete.forEach(appointment => {
            axios.delete(`http://localhost:8081/appointments/${appointment.id}`)
                .then(response => {
                    console.log("Past appointment deleted:", appointment.id);
                })
                .catch(error => {
                    console.error('Error deleting past appointment:', error);
                });
        });
    };

    const handleDelete = (appointmentId) => {
        console.log("Deleting appointment ID:", appointmentId);
        axios.delete(`http://localhost:8081/appointments/${appointmentId}`)
            .then(response => {
                fetchAppointments();
                navigate('/administration');
            })
            .catch(error => {
                console.error('Error deleting appointment:', error);
            });
    };

    const getUserFullName = (userId, users) => {
        const user = users.find(user => user.id === userId);
        if (user) {
            return `${user.first_name} ${user.last_name}`;
        }
        return '';
    };

    return (
        <div className="administration-container">
            <h1>Appointments</h1>
            {appointments.length > 0 ? (
                <table className="appointments-table">
                    <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Service</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Delete</th>
                    </tr>
                    </thead>
                    <tbody>
                    {appointments.map(appointment => (
                        <tr key={appointment.id}>
                            <td>{getUserFullName(appointment.user_id, users)}</td>
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
    );
}

export default AdminPage;