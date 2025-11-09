import {body,validationResult} from 'express-validator'

const respondWithValidationErrors =  (req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors:errors.array()
        })
    }
    next()
}

const registerUserValidations = [
    body("username")
    .isString()
    .withMessage("Username must be a string")
    .isLength({min:3})
    .withMessage("Minimum length of usernae must be 3"),

    body("email")
    .isEmail()
    .withMessage("Enter a valid username"),

    body("password")
    .isLength({min:6})
    .withMessage("Minimum length of password must be 6"),

    body("fullname.firstName")
    .isString()
    .withMessage("First name must be a string")
    .notEmpty()
    .withMessage("First name must not be empty"),

    respondWithValidationErrors

]

const loginUserValidation = [
    // either username or email must be present
    body().custom((_, { req }) => {
        if (!req.body.username && !req.body.email) {
            throw new Error('Either username or email is required')
        }
        return true
    }),

    // if username provided, validate it
    body('username')
        .optional()
        .isString()
        .withMessage('Username must be a string')
        .isLength({ min: 3 })
        .withMessage('Minimum length of username must be 3'),

    // if email provided, validate it
    body('email')
        .optional()
        .isEmail()
        .withMessage('Enter a valid email'),

    // password is required for login
    body('password')
        .exists()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Minimum length of password must be 6'),

    respondWithValidationErrors
]

// Address validator added to match addressSchema in user.model.js
const addressValidator = [
    body('street')
        .exists()
        .withMessage('Street is required')
        .bail()
        .isString()
        .withMessage('Street must be a string')
        .trim()
        .notEmpty()
        .withMessage('Street must not be empty')
        .isLength({ max: 200 })
        .withMessage('Street can be at most 200 characters'),

    body('city')
        .exists()
        .withMessage('City is required')
        .bail()
        .isString()
        .withMessage('City must be a string')
        .trim()
        .notEmpty()
        .withMessage('City must not be empty'),

    body('state')
        .exists()
        .withMessage('State is required')
        .bail()
        .isString()
        .withMessage('State must be a string')
        .trim()
        .notEmpty()
        .withMessage('State must not be empty'),

    body('country')
        .exists()
        .withMessage('Country is required')
        .bail()
        .isString()
        .withMessage('Country must be a string')
        .trim()
        .notEmpty()
        .withMessage('Country must not be empty'),

    body('pincode')
    .isString()
    .withMessage("Pincode must be a string")
    .notEmpty()
    .withMessage("Pincode is required"),         

    body('isDefault')
        .optional()
        .isBoolean()
        .withMessage('isDefault must be a boolean'),

    respondWithValidationErrors
]

export {registerUserValidations, loginUserValidation, addressValidator}