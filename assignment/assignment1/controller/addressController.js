const addressModel = require("../model/addressModel");
const {
  createAddresses,
  getAddress,
  getAllAddress,
  updateAddress,
  deleteAddress,
  findAddress,
  searchAddress,
} = require("../service/addressService");

const createAddress = async (req, res) => {
  try {
    const { type, address, city, state, pincode, longitude, latitude } =
      req.body;
    const location = {
      type: "Point",
      coordinates: [longitude, latitude],
    };
    const newAddress = await createAddresses(
      req.user.userID,
      type,
      address,
      city,
      state,
      pincode,
      location,
    );

    res.status(201).json({
      message: "Address created successfully",
      address: newAddress,
    });
  } catch (err) {
    console.log(err);

    if (err.message.includes("already exists")) {
      return res.status(409).json({
        message: err.message,
      });
    }

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getAddresses = async (req, res) => {
  try {
    const address = await getAddress(req.user.userID);
    res.json({ message: "addresses fetched successfully!", address });
  } catch (err) {
    console.log(err);
    if (err.message == "address not found")
      return res.status(404).json({ message: "address not found" });
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};

const getAllAddresses = async (req, res) => {
  try {
    const addresses = await getAllAddress();
    res.json({
      message: "All users addresses fetched successfully!",
      addresses,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};

const updAddress = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        message: "give id to update address!",
      });
    }

    const address = await updateAddress(
      id,
      req.user.userID,
      req.user.role,
      req.body,
    );

    return res.json({
      message: "address updated successfully!!",
      address,
    });
  } catch (err) {
    console.log(err);

    if (err.message === "address not found") {
      return res.status(404).json({
        message: "address not found",
      });
    }

    return res.status(500).json({
      message: "INTERNAL SERVER ERROR",
    });
  }
};

const delAddress = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        message: "give id to delete address!",
      });
    }

    const address = await deleteAddress(id, req.user.userID, req.user.role);

    return res.json({
      message: "address deleted successfully!!",
      address,
    });
  } catch (err) {
    console.log(err);

    if (err.message === "address not found") {
      return res.status(404).json({
        message: "address not found",
      });
    }

    return res.status(500).json({
      message: "INTERNAL SERVER ERROR",
    });
  }
};

const findAddressNearMe = async (req, res) => {
  try {
    const { longitude, latitude, distance } = req.query;
    const addresses = await findAddress(
      longitude,
      latitude,
      distance,
      req.user.userID,
    );
    if (addresses.length === 0)
      return res.status(404).json({ message: "address not found" });
    res.json({
      message: `${addresses.length} addresses are near by you....`,
      addresses,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};

const searchAddresses = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({
        message: "search query is required",
      });
    }

    const address = await searchAddress(query,req.user.userID);
    return res.json({ address });
  } catch (err) {
    console.log(err);
    if (err.message == "address not found!!")
      return res.status(404).json({ message: "address not found!!" });
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};

module.exports = {
  createAddress,
  getAddresses,
  getAllAddresses,
  updAddress,
  delAddress,
  findAddressNearMe,
  searchAddresses,
};
