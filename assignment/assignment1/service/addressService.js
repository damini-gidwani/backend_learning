const addressModel = require("../model/addressModel");

const createAddresses = async (
  user,
  type,
  address,
  city,
  state,
  pincode,
  location,
) => {
  const addressExist = await addressModel.findOne({
    user,
    type,
  });

  if (addressExist) {
    throw new Error(`${type} address already exists`);
  }

  const newAddress = await addressModel.create({
    user,
    type,
    address,
    city,
    state,
    pincode,
    location,
  });
  return newAddress;
};

const getAddress = async (userID) => {
  const addressExist = await addressModel
    .find({
      user: userID,
    })
    .populate("user", "fname lname email");

  if (addressExist.length === 0) {
    throw new Error("address not found");
  }

  return addressExist;
};

const getAllAddress = async () => {
  return await addressModel.find({}).populate("user", "fname lname email");
};

const updateAddress = async (id, userID, role, data) => {
  const filter = role === "admin" ? { _id: id } : { _id: id, user: userID };

  const newAdd = await addressModel.findOneAndUpdate(
    filter,
    {
      $set: data,
    },
    {
      returnDocument: "after",
    },
  );

  if (!newAdd) {
    throw new Error("address not found");
  }

  return newAdd;
};

const deleteAddress = async (id, userID, role) => {
  const filter = role === "admin" ? { _id: id } : { _id: id, user: userID };

  const deletedAddress = await addressModel.findOneAndDelete(filter);

  if (!deletedAddress) {
    throw new Error("address not found");
  }

  return deletedAddress;
};

const findAddress = async (long, lat, distance, id) => {
  return await addressModel
    .find({
      user: { $ne: id }, //exclude loggedIn user address
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [Number(long), Number(lat)],
          },
          $maxDistance: Number(distance),
        },
      },
    })
    .select("-_id")
    .populate("user", "fname lname email -_id");
};

const searchAddress = async (query,user) => {
  const address = await addressModel.find({
    user:user,
    address: {
      $regex: query,
      $options: "i",
    },
  }).select("-_id").populate("user","fname lname email -_id");
  if (address.length === 0) {
    throw new Error("address not found!!");
  }
  return address;
};

module.exports = {
  createAddresses,
  getAddress,
  getAllAddress,
  updateAddress,
  deleteAddress,
  findAddress,
  searchAddress
};
