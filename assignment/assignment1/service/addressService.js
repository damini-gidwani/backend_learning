const addressModel = require("../model/addressModel");

const createAddresses = async (user, type, address, city, state, pincode) => {
  const addressExist = await addressModel.findOne({
    user,
    address,
    city,
    state,
    pincode,
  });

  if (addressExist) {
    throw new Error("address already exists");
  }

  const newAddress = await addressModel.create({
    user,
    type,
    address,
    city,
    state,
    pincode,
  });
  return newAddress;
};

const getAddress = async (userID) => {
  const addressExist = await addressModel.find({
    user: userID,
  });

  if (addressExist.length === 0) {
    throw new Error("address not found");
  }

  return addressExist;
};

const getAllAddress = async () => {
  return await addressModel.find({}).populate("user", "fname lname email");
};

const updateAddress = async (id, userID, role, data) => {
  const filter =
    role === "admin"
      ? { _id: id }
      : { _id: id, user: userID };

  const newAdd = await addressModel.findOneAndUpdate(
    filter,
    {
      $set: data,
    },
    {
      returnDocument: "after",
    }
  );

  if (!newAdd) {
    throw new Error("address not found");
  }

  return newAdd;
};

const deleteAddress = async (id, userID, role) => {
  const filter =
    role === "admin"
      ? { _id: id }
      : { _id: id, user: userID };

  const deletedAddress = await addressModel.findOneAndDelete(filter);

  if (!deletedAddress) {
    throw new Error("address not found");
  }

  return deletedAddress;
};

module.exports = { createAddresses, getAddress, getAllAddress, updateAddress, deleteAddress };
