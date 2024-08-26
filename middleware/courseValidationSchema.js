const { body } = require("express-validator");

module.exports = () => {
  return [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("price").notEmpty().withMessage("Price is required"),
  ];
};
