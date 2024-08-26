const { body } = require("express-validator");

module.exports = () => {
  return [
    (body("fName").notEmpty().withMessage("First name is required"),
    body("lName").notEmpty().withMessage("Last name is required"),
    body("email").isEmail().withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required"),
    body("role").notEmpty().withMessage("Role is required")),
  ];
};
