const {
  createAddresses,
  getAddress,
  getAllAddress,
  updateAddress,
  deleteAddress,
} = require("../service/addressService");

const createAddress = async (req, res) => {
  try {
    const { type, address, city, state, pincode } = req.body;
    const newAddress = await createAddresses(
      req.user.userID,
      type,
      address,
      city,
      state,
      pincode,
    );
    res.status(201).json({
      message: "Address created successfully",
      address: newAddress,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
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

module.exports = {
  createAddress,
  getAddresses,
  getAllAddresses,
  updAddress,
  delAddress,
};
