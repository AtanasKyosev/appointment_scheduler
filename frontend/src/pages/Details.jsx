import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


const Details = () => {
    const { id } = useParams();
    const [service, setService] = useState(null);

    useEffect(() => {
        fetch("/services.json")
            .then(response => response.json())
            .then(data => {
                const foundService = data.find(s => s.service_id === parseInt(id));
                setService(foundService);
            })
            .catch(error => console.error('Error fetching service data:', error));
    }, [id]);

    if (!service) {
        return <div>Loading...</div>;
    }

    return (
        <div className="service-details">
            <h1>{service.service_name}</h1>
            <img src={service.image} alt={service.service_name} />
            <p>{service.service_details}</p>
            <h2>Price: {service.price}</h2>
            <Link className="link" to="/book">Book Now!</Link>
        </div>
    );
};

export default Details;
