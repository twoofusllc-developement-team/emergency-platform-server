import Button from "./Button";
import "./Services.css";
function Services() {
    return(
        <div >
            <h1>Choose your Emergency Service</h1>
            <div class="grid">
            <Button text="Add Shelter" ></Button>
            <Button text="Book Shelter" ></Button>
            <Button text="Emergency " ></Button>
            <Button text="Mobility" ></Button>
            <Button text="Blood in need" ></Button>
            <Button text="Donation" ></Button>
            </div>
        </div>
    );
}
export default Services;