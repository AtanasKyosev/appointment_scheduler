import { Link } from "react-router-dom";

const Services = () => {
    return (
        <>
            <div className="services-container">
                <h1>Our Services</h1>
                <div className={"cards"}>
                    <div className={"card"}>
                        <img src={"/images/haircut.jpg"} alt="haircut" />
                        <div className={"text"}>
                            <h3>Haircut</h3>
                            <p>Price: $ 15</p>
                            <Link className="link" to="/services/details/1">Read more ...</Link>
                        </div>
                    </div>

                    <div className={"card"}>
                        <img src={"/images/beard.jpg"} alt="beard" />
                        <div className={"text"}>
                            <h3>Beard</h3>
                            <p>Price: $ 15</p>
                            <Link className="link" to="/services/details/2">Read more ...</Link>
                        </div>
                    </div>

                    <div className={"card"}>
                        <img src={"/images/combo.webp"} alt="combo" />
                        <div className={"text"}>
                            <h3>Combo H&B</h3>
                            <p>Price: $ 20</p>
                            <Link className="link" to="/services/details/3">Read more ...</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Services;
