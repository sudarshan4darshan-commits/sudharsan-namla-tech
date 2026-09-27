import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./hoteldetails.css";

function HotelDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const hotel = location.state?.hotel;

  const [currentPhoto, setCurrentPhoto] = useState(0);

  if (!hotel) {
    return (
      <div className="hotel-details">
        <div className="details-info">
          <div className="hotel-content">
            <h2>Hotel not found</h2>

            <button onClick={() => navigate("/")}>
              Back to Hotels
            </button>
          </div>
        </div>
      </div>
    );
  }

  const latitude = Number(hotel.latitude);
  const longitude = Number(hotel.longitude);

  const photos =
    hotel.images && hotel.images.length > 0
      ? hotel.images
      : [
          "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        ];

  const nextPhoto = () => {
    setCurrentPhoto(
      (previousPhoto) =>
        (previousPhoto + 1) % photos.length
    );
  };

  const previousPhoto = () => {
    setCurrentPhoto(
      (previousPhoto) =>
        (previousPhoto - 1 + photos.length) %
        photos.length
    );
  };

  return (
    <div className="hotel-details">

      <div className="details-image">

        <img
          src={photos[currentPhoto]}
          alt={hotel.name}
        />

        {photos.length > 1 && (
          <button
            className="photo-button previous"
            onClick={previousPhoto}
            type="button"
          >
            ‹
          </button>
        )}

        {photos.length > 1 && (
          <button
            className="photo-button next"
            onClick={nextPhoto}
            type="button"
          >
            ›
          </button>
        )}

      </div>

      <div className="details-info">

        <div className="hotel-heading">

          <h1>
            {hotel.name}
          </h1>

          <h2>
            ₹{hotel.price} per day
          </h2>

        </div>

        <div className="hotel-content">

          <div className="details-description">

            {hotel.description}

          </div>

          <div className="details-location">

            <h3>
              📍 Location
            </h3>

            <p>
              Latitude: {hotel.latitude}
              <br />
              Longitude: {hotel.longitude}
            </p>

            <div className="hotel-map">

              <MapContainer
                center={[
                  latitude,
                  longitude,
                ]}
                zoom={15}
                scrollWheelZoom={true}
              >

                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker
                  position={[
                    latitude,
                    longitude,
                  ]}
                >

                  <Popup>
                    {hotel.name}
                  </Popup>

                </Marker>

              </MapContainer>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default HotelDetails;