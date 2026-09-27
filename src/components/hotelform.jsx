import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addHotel,
  updateHotel,
} from "../redux/hotelslice";
import "./hotelform.css";

function HotelForm({ editMode = false, hotel = null }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [hotelName, setHotelName] = useState(
    editMode && hotel ? hotel.name : ""
  );

  const [price, setPrice] = useState(
    editMode && hotel
      ? String(hotel.price)
      : ""
  );

  const [description, setDescription] = useState(
    editMode && hotel
      ? hotel.description
      : ""
  );

  const [latitude, setLatitude] = useState(
    editMode && hotel
      ? String(hotel.latitude)
      : ""
  );

  const [longitude, setLongitude] = useState(
    editMode && hotel
      ? String(hotel.longitude)
      : ""
  );

  const [images, setImages] = useState(
    editMode && hotel
      ? hotel.images || []
      : []
  );

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(
      e.target.files
    );

    selectedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        setImages((previousImages) => [
          ...previousImages,
          reader.result,
        ]);
      };

      reader.readAsDataURL(file);
    });
  };

  const removeImage = (indexToRemove) => {
    setImages((previousImages) =>
      previousImages.filter(
        (_, index) =>
          index !== indexToRemove
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hotelData = {
      ...(editMode && hotel
        ? {
            id: hotel.id,
          }
        : {}),

      name: hotelName,

      price: Number(price),

      description: description,

      latitude: Number(latitude),

      longitude: Number(longitude),

      images: images,
    };

    try {
      if (editMode) {
        await dispatch(
          updateHotel(hotelData)
        ).unwrap();
      }

      else {
        await dispatch(
          addHotel(hotelData)
        ).unwrap();
      }

      navigate("/");

    } catch (error) {
      console.error(
        "HOTEL SAVE ERROR:",
        error
      );

      alert(
        `Could not save hotel.\n\nError: ${
          error?.message || error
        }`
      );
    }
  };

  return (
    <form
      className="hotel-form"
      onSubmit={handleSubmit}
    >
      <h2>
        {editMode
          ? "EDIT HOTEL"
          : "ADD HOTEL"}
      </h2>

      <label>
        Hotel Name
      </label>

      <input
        type="text"
        placeholder="Enter hotel name"
        value={hotelName}
        onChange={(e) =>
          setHotelName(e.target.value)
        }
        required
      />

      <label>
        Price
      </label>

      <input
        type="number"
        placeholder="Enter price per day"
        value={price}
        onChange={(e) =>
          setPrice(e.target.value)
        }
        required
      />

      <label>
        Description
      </label>

      <textarea
        placeholder="Enter full hotel description"
        value={description}
        onChange={(e) =>
          setDescription(e.target.value)
        }
        required
      />

      <label>
        Latitude
      </label>

      <input
        type="number"
        step="any"
        placeholder="Enter latitude"
        value={latitude}
        onChange={(e) =>
          setLatitude(e.target.value)
        }
        required
      />

      <label>
        Longitude
      </label>

      <input
        type="number"
        step="any"
        placeholder="Enter longitude"
        value={longitude}
        onChange={(e) =>
          setLongitude(e.target.value)
        }
        required
      />

      <label>
        Hotel Photos
      </label>

      <input
        type="file"
        id="hotelPhotoInput"
        className="hidden-file-input"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        required={images.length === 0}
      />

      <label
        htmlFor="hotelPhotoInput"
        className="file-upload-btn"
      >
        {images.length > 0
          ? `${images.length} photo${
              images.length > 1 ? "s" : ""
            } added — add more`
          : "Choose Photos"}
      </label>

      {images.length > 0 && (
        <div className="image-preview">

          {images.map(
            (image, index) => (
              <div
                className="image-preview-item"
                key={index}
              >

                <img
                  src={image}
                  alt={`Hotel ${
                    index + 1
                  }`}
                />

                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={() =>
                    removeImage(index)
                  }
                >
                  ×
                </button>

              </div>
            )
          )}

        </div>
      )}

      <button
        className="submit-btn"
        type="submit"
      >
        {editMode
          ? "Update Hotel"
          : "Add Hotel"}
      </button>

    </form>
  );
}

export default HotelForm;