import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import "../custom-date-picker.css"
import {addDays, isWeekend} from "date-fns"
import dayjs from "dayjs";
import validateBooking from '../validators/BookValidator.jsx';


function Book() {
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get('http://localhost:8081')
            .then(res => {
                if (res.data.valid) {
                    setUserId(res.data.user.id);
                } else {
                    navigate('/login');
                }
            })
            .catch(err => console.log(err));
    }, []);

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedService, setSelectedService] = useState('');
    const [userId, setUserId] = useState('');
    const [errors, setErrors] = useState({});

    const handleDataChange = (date) => {
        setSelectedDate(date);
    };

    const handleServiceChange = (event) => {
        setSelectedService(event.target.value);
    };

    // Making the dates available for one month ahead
    const minDate = new Date();
    const maxDate = new Date();
    maxDate.setDate(minDate.getDate() + 31);

    // Restricting Saturdays and Sundays
    const isWeekendDay = (date) => {
        return isWeekend(date);
    };

    const filterWeekends = (date) => {
        return !isWeekendDay(date);
    };

    // Setting hours
    const generateTimes = () => {
        const times = [];
        const start = new Date();
        start.setHours(9, 0, 0, 0);
        const end = new Date();
        end.setHours(17, 0, 0, 0);

        for (let time = new Date(start); time <= end; time.setMinutes(time.getMinutes() + 60)) {
            if (time.getHours() !== 13) {
                times.push(new Date(time));
            }
        }
        return times;
    };

    const includedTimes = generateTimes();

    const handleBook = (event) => {
        event.preventDefault();

        const appointmentData = {
            date: selectedDate ? dayjs(selectedDate).format("YYYY-MM-DD") : '',
            time: selectedDate ? dayjs(selectedDate).format("HH:mm:ss") : '',
            service: selectedService,
            user_id: userId
        };

        const validationErrors = validateBooking(appointmentData);
        setErrors(validationErrors);

        const hasErrors = Object.values(validationErrors).some(error => error);
        if (!hasErrors) {
            axios.post('http://localhost:8081/book', appointmentData)
                .then(response => {
                    console.log("Appointment booked successfully:", response.data);
                    navigate('/profile');
                })
                .catch(error => {
                    console.error("There was an error booking the appointment!", error);
                });
        } else {
            console.log("Please fill in all required fields.");
        }
    };

    return (
        <div className="calendar-container">
            <h1>Book</h1>

            <DatePicker
                inline
                selected={selectedDate}
                onChange={handleDataChange}
                dateFormat="dd/MM/YYYY; HH:mm"
                minDate={minDate}
                maxDate={maxDate}
                filterDate={filterWeekends}
                showTimeSelect
                timeIntervals={60}
                timeFormat="HH:mm"
                includeTimes={includedTimes}
            />

            <select value={selectedService} onChange={handleServiceChange}>
                <option value="">Select a service</option>
                <option value="Haircut">Haircut</option>
                <option value="Beard">Beard</option>
                <option value="Combo H&B">Combo H&B</option>
            </select>

            {errors.date && <p className="error">{errors.date}</p>}
            {errors.time && <p className="error">{errors.time}</p>}
            {errors.service && <p className="error">{errors.service}</p>}

            <button className="btn" onClick={handleBook}>Book</button>
        </div>
    );
}

export default Book;
