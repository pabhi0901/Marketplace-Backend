import { body, validationResult } from 'express-validator';

// Validator for adding item to cart
export const validateAddToCart = [
    body('productId')
        .notEmpty()
        .withMessage('Product ID is required')
        .isMongoId()
        .withMessage('Product ID must be a valid MongoDB ObjectId'),
    
    body('quantity')
        .notEmpty()
        .withMessage('Quantity is required'),
    
    // Middleware to handle validation errors
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        next();
    }
];

// Validator for updating cart item quantity
export const validateUpdateCartItem = [
    body('productId')
        .notEmpty()
        .withMessage('Product ID is required')
        .isMongoId()
        .withMessage('Product ID must be a valid MongoDB ObjectId'),
    
    body('quantity')
        .notEmpty()
        .withMessage('Quantity is required'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        next();
    }
];

// Validator for removing item from cart
export const validateRemoveFromCart = [
    body('productId')
        .notEmpty()
        .withMessage('Product ID is required')
        .isMongoId()
        .withMessage('Product ID must be a valid MongoDB ObjectId'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        next();
    }
];
