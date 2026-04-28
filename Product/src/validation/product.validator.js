import { body, validationResult } from "express-validator";

// Export only this. It contains both rules and the final error handler.
export const createProductValidator = [
  body("title")
    .exists({ checkFalsy: true })
    .withMessage("title is required")
    .isString()
    .withMessage("title must be a string")
    .trim()
    .isLength({ max: 150 })
    .withMessage("title must be at most 150 characters"),

  body("description")
    .optional({ values: "falsy" })
    .isString()
    .withMessage("description must be a string")
    .trim()
    .isLength({ max: 2000 })
    .withMessage("description must be at most 2000 characters"),

  body("priceAmount")
    .exists()
    .withMessage("price.amount is required")
    .isFloat({ gt: 0 })
    .withMessage("price.amount must be greater than 0"),

  body("priceCurrency")
    .optional({ values: "falsy" })
    .isIn(["INR", "USD"])
    .withMessage("price.currency must be either INR or USD"),

  body("images").custom((value, { req }) => {
  if (!req.files || req.files.length === 0) {
    throw new Error("At least one image is required");
  }
  if (req.files.length > 5) {
    throw new Error("You can upload up to 5 images only");
  }
  return true;
}),


  // Final error handler (kept internal to the validator export)
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        mess: "Validation failed",
        errors: errors.array().map((e) => ({ field: e.path, msg: e.msg }))
      });
    }
    next();
  }
];

export default { createProductValidator };
