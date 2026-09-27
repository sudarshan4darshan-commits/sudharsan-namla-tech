import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

const API_URL = "http://localhost:5000/api/hotels";



const handleResponse = async (response) => {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message ||
      `Request failed with status ${response.status}`
    );
  }

  return data;
};



export const fetchHotels = createAsyncThunk(
  "hotels/fetchHotels",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL);

      return await handleResponse(response);
    } catch (error) {
      console.error(
        "FETCH HOTELS ERROR:",
        error
      );

      return rejectWithValue(
        error.message
      );
    }
  }
);



export const addHotel = createAsyncThunk(
  "hotels/addHotel",
  async (hotel, { rejectWithValue }) => {
    try {
      console.log(
        "ADDING HOTEL:",
        hotel
      );

      const response = await fetch(
        API_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(hotel),
        }
      );

      const data =
        await handleResponse(response);

      console.log(
        "HOTEL ADDED:",
        data
      );

      return data;
    } catch (error) {
      console.error(
        "ADD HOTEL ERROR:",
        error
      );

      return rejectWithValue(
        error.message
      );
    }
  }
);



export const updateHotel = createAsyncThunk(
  "hotels/updateHotel",
  async (hotel, { rejectWithValue }) => {
    try {
      console.log(
        "UPDATING HOTEL:",
        hotel
      );

      const response = await fetch(
        `${API_URL}/${hotel.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(hotel),
        }
      );

      const data =
        await handleResponse(response);

      console.log(
        "HOTEL UPDATED:",
        data
      );

      return data;
    } catch (error) {
      console.error(
        "UPDATE HOTEL ERROR:",
        error
      );

      return rejectWithValue(
        error.message
      );
    }
  }
);



export const deleteHotel = createAsyncThunk(
  "hotels/deleteHotel",
  async (hotelId, { rejectWithValue }) => {
    try {
      console.log(
        "DELETING HOTEL:",
        hotelId
      );

      const response = await fetch(
        `${API_URL}/${hotelId}`,
        {
          method: "DELETE",
        }
      );

      await handleResponse(response);

      console.log(
        "HOTEL DELETED:",
        hotelId
      );

      return hotelId;
    } catch (error) {
      console.error(
        "DELETE HOTEL ERROR:",
        error
      );

      return rejectWithValue(
        error.message
      );
    }
  }
);



const initialState = {
  hotels: [],
  loading: false,
  error: null,
};


const hotelSlice = createSlice({
  name: "hotels",

  initialState,

  reducers: {},

  extraReducers: (builder) => {

    // =================================================
    // FETCH HOTELS
    // =================================================

    builder

      .addCase(
        fetchHotels.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchHotels.fulfilled,
        (state, action) => {
          state.loading = false;
          state.error = null;

          state.hotels =
            action.payload;
        }
      )

      .addCase(
        fetchHotels.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to fetch hotels";
        }
      )

      

      .addCase(
        addHotel.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        addHotel.fulfilled,
        (state, action) => {
          state.loading = false;
          state.error = null;

          state.hotels.unshift(
            action.payload
          );
        }
      )

      .addCase(
        addHotel.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to add hotel";
        }
      )

      

      .addCase(
        updateHotel.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        updateHotel.fulfilled,
        (state, action) => {
          state.loading = false;
          state.error = null;

          const index =
            state.hotels.findIndex(
              (hotel) =>
                Number(hotel.id) ===
                Number(
                  action.payload.id
                )
            );

          if (index !== -1) {
            state.hotels[index] =
              action.payload;
          }
        }
      )

      .addCase(
        updateHotel.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to update hotel";
        }
      )

      
      .addCase(
        deleteHotel.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        deleteHotel.fulfilled,
        (state, action) => {
          state.loading = false;
          state.error = null;

          state.hotels =
            state.hotels.filter(
              (hotel) =>
                Number(hotel.id) !==
                Number(action.payload)
            );
        }
      )

      .addCase(
        deleteHotel.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to delete hotel";
        }
      );
  },
});

export default hotelSlice.reducer;