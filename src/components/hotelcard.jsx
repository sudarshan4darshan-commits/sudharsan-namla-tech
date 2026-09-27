import { useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteHotel } from "../redux/hotelslice";
import "./hotelcard.css";

function HotelCard({ hotel }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleEdit = (e) => {
    e.stopPropagation();

    navigate("/edit-hotel", {
      state: {
        hotel: hotel,
      },
    });
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();

    setShowMenu(false);
    setShowConfirm(true);
  };

  const confirmDelete = (e) => {
    e.stopPropagation();

    dispatch(deleteHotel(hotel.id));

    setShowConfirm(false);

    window.dispatchEvent(
      new CustomEvent("showToast", {
        detail: "Hotel deleted successfully!",
      })
    );
  };

  const cancelDelete = (e) => {
    e.stopPropagation();

    setShowConfirm(false);
  };

  const handleCardClick = () => {
    navigate("/hotel-details", {
      state: {
        hotel: hotel,
      },
    });
  };

  const snippet =
    hotel.description && hotel.description.length > 120
      ? hotel.description.slice(0, 120).trim() + "…"
      : hotel.description;

  return (
    <div
      className="hotel-card"
      onMouseLeave={() => setShowMenu(false)}
    >
      <div
        className="hotel-image"
        onClick={handleCardClick}
      >
        <img
          src={
            hotel.images &&
            hotel.images.length > 0
              ? hotel.images[0]
              : "https://images.unsplash.com/photo-1566073771259-6a8506099945"
          }
          alt={hotel.name}
        />

        <div
          className="hotel-menu"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="three-dot-btn"
            onClick={(e) => {
              e.stopPropagation();

              setShowMenu(
                (previous) => !previous
              );
            }}
          >
            ⋮
          </button>

          {showMenu && (
            <div
              className="menu-options"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={handleEdit}
              >
                ✏️ Edit Hotel
              </button>

              <button
                type="button"
                onClick={handleDeleteClick}
              >
                🗑️ Delete Hotel
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        className="hotel-info"
        onClick={handleCardClick}
      >
        <h2>
          {hotel.name}
        </h2>

        <p className="hotel-price">
          ₹{hotel.price} per day
        </p>

        <p className="hotel-snippet">
          {snippet}
        </p>

        <p className="hotel-location">
          📍 {hotel.latitude},{" "}
          {hotel.longitude}
        </p>
      </div>

      {showConfirm &&
        createPortal(
          <div
            className="confirm-overlay"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="confirm-box">
              <h3>Delete this hotel?</h3>

              <p>
                This action cannot be undone.
                "{hotel.name}" will be
                permanently removed.
              </p>

              <div className="confirm-actions">
                <button
                  type="button"
                  className="confirm-cancel-btn"
                  onClick={cancelDelete}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="confirm-delete-btn"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

export default HotelCard;