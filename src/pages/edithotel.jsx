import { useLocation, useNavigate } from "react-router-dom";
import HotelForm from "../components/hotelform";

function EditHotel() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get the selected hotel from the navigation state
  const hotel = location.state?.hotel;

  // ===============================
  // NO HOTEL SELECTED
  // ===============================

  if (!hotel) {
    return (
      <div className="edit-error">
        <h2>No hotel selected</h2>

        <p>
          Please select a hotel before trying
          to edit it.
        </p>

        <button
          type="button"
          onClick={() => navigate("/")}
        >
          Back to Hotels
        </button>
      </div>
    );
  }

  // ===============================
  // EDIT HOTEL
  // ===============================

  return (
    <HotelForm
      editMode={true}
      hotel={hotel}
    />
  );
}

export default EditHotel;