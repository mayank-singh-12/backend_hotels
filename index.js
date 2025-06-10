const { initializeDatabase } = require("./db/db.connect");
const Hotel = require("./models/hotel.models");
const express = require("express");
const cors = require("cors");
const app = express();
initializeDatabase();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// const newHotelOne = {
//   name: "Sunset Resort",
//   category: "Resort",
//   location: "12 Main Road, Anytown",
//   rating: 4.0,
//   reviews: [],
//   website: "https://sunset-example.com",
//   phoneNumber: "+1299655890",
//   checkInTime: "2:00 PM",
//   checkOutTime: "11:00 AM",
//   amenities: [
//     "Room Service",
//     "Horse riding",
//     "Boating",
//     "Kids Play Area",
//     "Bar",
//   ],
//   priceRange: "$$$$ (61+)",
//   reservationsNeeded: true,
//   isParkingAvailable: true,
//   isWifiAvailable: true,
//   isPoolAvailable: true,
//   isSpaAvailable: true,
//   isRestaurantAvailable: true,
//   photos: [
//     "https://example.com/hotel2-photo1.jpg",
//     "https://example.com/hotel2-photo2.jpg",
//   ],
// };

async function createHotel(newHotel) {
  const hotel = new Hotel(newHotel);
  const saveData = await hotel.save();
  return saveData;
}

app.post("/hotels", async (req, res) => {
  try {
    const savedData = await createHotel(req.body);
    res.status(201).json({ message: "New hotel added.", hotel: savedData });
  } catch {
    res.status(500).json({ error: "Found error while adding a new hotel." });
  }
});

// Read all hotels from database.
async function readAllHotels() {
  const hotels = await Hotel.find();
  return hotels;
}
// readAllHotels();
app.get("/hotels", async (req, res) => {
  try {
    const hotels = await readAllHotels();
    if (hotels.length != 0) {
      res.json(hotels);
    } else {
      res.status(404), json({ error: "Hotels not found." });
    }
  } catch {
    res.status(500).json({ error: "Error while fetching data." });
  }
});

// Read hotel by name.
async function readHotelsByName(hotelName) {
  const hotel = await Hotel.findOne({ name: hotelName });
  return hotel;
}
// readHotelsByName("Lake View");

app.get("/hotels/:hotelName", async (req, res) => {
  try {
    const hotel = await readHotelsByName(req.params.hotelName);
    if (hotel) {
      res.json(hotel);
    } else {
      res.status(404).json({ error: "Hotel not found." });
    }
  } catch {
    res.status(500).json({ error: "Error while fetching data." });
  }
});

// Read hotel with parking space.
async function readHotelsByParkingSpace(parking) {
  const hotels = await Hotel.find({ isParkingAvailable: parking });
  console.log(hotels);
}

// readHotelsByParkingSpace(true);

async function readHotelsByRestaurantSpace(restaurant) {
  console.log("-------Hotels---------");
  const hotels = await Hotel.find({ isRestaurantAvailable: restaurant });
  console.log(hotels);
}

// readHotelsByRestaurantSpace(true);

async function readHotelsByCategory(selectedCategory) {
  const hotels = await Hotel.find({ category: selectedCategory });
  console.log(hotels);
}
// readHotelsByCategory("Mid-Range");

async function readHotelsByPriceRange(givenPriceRange) {
  const hotels = await Hotel.find({ priceRange: givenPriceRange });
  console.log(hotels);
}
// readHotelsByPriceRange("$$$$ (61+)");

async function readHotelsByRating(givenRating) {
  const hotels = await Hotel.find({ rating: givenRating });
  console.log(hotels);
}
// readHotelsByRating(4);

async function readHotelByPhoneNumber(givenPhoneNumber) {
  const hotel = await Hotel.findOne({ phoneNumber: givenPhoneNumber });
  return hotel;
}

// readHotelByPhoneNumber("+1299655890");
app.get("/hotels/directory/:phoneNumber", async (req, res) => {
  try {
    const hotel = await readHotelByPhoneNumber(req.params.phoneNumber);
    if (hotel) {
      res.json(hotel);
    } else {
      res.status(404).json({ error: "Hotel not found." });
    }
  } catch {
    res.status(500).json({ error: "Error while fetching data." });
  }
});

async function getHotelByRating(rating) {
  const hotel = await Hotel.findOne({ rating: rating });
  return hotel;
}

app.get("/hotels/rating/:hotelRating", async (req, res) => {
  try {
    const hotel = await getHotelByRating(req.params.hotelRating);
    if (hotel) {
      res.json(hotel);
    } else {
      res.status(404).json({ error: "Hotel not found." });
    }
  } catch {
    res.status(500).json({ error: "Error while fetching data." });
  }
});

async function getHotelByCatgory(category) {
  const hotel = await Hotel.find({ category: category });
  return hotel;
}

app.get("/hotels/category/:category", async (req, res) => {
  try {
    const hotels = await getHotelByCatgory(req.params.category);
    if (hotels) {
      res.json(hotels);
    } else {
      res.status(404).json({ error: "Hotel not found." });
    }
  } catch {
    res.status(500).json({ error: "Error while fetching data." });
  }
});

async function removeHotelById(hotelId) {
  const deleteHotel = await Hotel.findByIdAndDelete(hotelId);
  return deleteHotel;
}

app.delete("/hotels/:hotelId", async (req, res) => {
  try {
    const deletedHotel = await removeHotelById(req.params.hotelId);
    if (deletedHotel) {
      res
        .status(200)
        .json({ message: "Hotel deleted successfully.", hotel: deletedHotel });
    } else {
      res.status(404).json({ error: "Hotel not found." });
    }
  } catch {
    res.status(500).json({ error: "Error occured while deleting hotel." });
  }
});

async function updateHotelByHotelId(hotelId, dataToUpdate) {
  try {
    const updateData = await Hotel.findByIdAndUpdate(hotelId, dataToUpdate, {
      new: true,
    });
    return updateData;
  } catch (error) {
    console.log("Found error while updating hotel:", error);
  }
}

app.post("/hotels/:hotelId", async (req, res) => {
  try {
    const updatedHotel = await updateHotelByHotelId(
      req.params.hotelId,
      req.body
    );
    if (updatedHotel) {
      res
        .status(200)
        .json({ message: "Successfully updated hotel.", hotel: updatedHotel });
    }
  } catch {
    res.status(500).json({ error: "Error while updating hotel data." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on PORT:", PORT);
});
