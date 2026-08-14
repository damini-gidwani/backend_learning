const updateAddPolicy = ({ user, resource }) => {
  if (user.role === "admin") return true;

  if ((user.role === "user" || user.role === "seller") && user.userID === resource.user.toString())
    return true;

  return false;
};
module.exports = { updateAddPolicy };