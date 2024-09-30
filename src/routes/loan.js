// src/routes/loan.js
const express = require("express");
const { body, param } = require("express-validator");
const loanController = require("../controllers/loanController");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Loans
 *   description: Loan management
 */

// Validation middleware
const calculateLoanValidators = [
  body("loanAmount").isNumeric().withMessage("Loan amount must be a number"),
  body("interestRate")
    .isFloat({ min: 0, max: 100 })
    .withMessage("Interest rate must be between 0 and 100"),
  body("loanTerm")
    .isInt({ min: 1 })
    .withMessage("Loan term must be a positive integer"),
];

const createLoanValidators = [
  body("borrowerName").notEmpty().withMessage("Borrower name is required"),
  body("loanAmount").isNumeric().withMessage("Loan amount must be a number"),
  body("interestRate")
    .isFloat({ min: 0, max: 100 })
    .withMessage("Interest rate must be between 0 and 100"),
  body("loanTerm")
    .isInt({ min: 1 })
    .withMessage("Loan term must be a positive integer"),
  body("paymentDueDate")
    .isISO8601()
    .withMessage("Payment due date must be a valid date"),
];

const updateLoanValidators = [
  body("borrowerName")
    .optional()
    .notEmpty()
    .withMessage("Borrower name cannot be empty"),
  body("loanAmount")
    .optional()
    .isNumeric()
    .withMessage("Loan amount must be a number"),
  body("interestRate")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("Interest rate must be between 0 and 100"),
  body("loanTerm")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Loan term must be a positive integer"),
  body("paymentDueDate")
    .optional()
    .isISO8601()
    .withMessage("Payment due date must be a valid date"),
];

const updateLoanStatusValidators = [
  body("status")
    .isIn(["Approved", "Pending", "Rejected"])
    .withMessage("Invalid status"),
];

const idValidator = [param("id").isMongoId().withMessage("Invalid loan ID")];

/**
 * @swagger
 * /api/loans/calculate:
 *   post:
 *     summary: Calculate total repayment amount for a loan
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               loanAmount:
 *                 type: number
 *               interestRate:
 *                 type: number
 *               loanTerm:
 *                 type: number
 *     responses:
 *       200:
 *         description: Total repayment calculated successfully
 *       400:
 *         description: Invalid input
 */
router.post(
  "/calculate",
  auth,
  calculateLoanValidators,
  validate,
  loanController.calculateLoan
);

/**
 * @swagger
 * /api/loans:
 *   post:
 *     summary: Create a new loan
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               borrowerName:
 *                 type: string
 *               loanAmount:
 *                 type: number
 *               interestRate:
 *                 type: number
 *               loanTerm:
 *                 type: number
 *               paymentDueDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Loan created successfully
 *       400:
 *         description: Invalid input
 */
router.post(
  "/",
  auth,
  createLoanValidators,
  validate,
  loanController.createLoan
);

/**
 * @swagger
 * /api/loans:
 *   get:
 *     summary: Get all loans
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of loans
 *       401:
 *         description: Unauthorized
 */
router.get("/", auth, loanController.getLoans);

/**
 * @swagger
 * /api/loans/{id}:
 *   get:
 *     summary: Get a specific loan by ID
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Loan ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Loan details
 *       404:
 *         description: Loan not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", auth, idValidator, validate, loanController.getLoan);

/**
 * @swagger
 * /api/loans/{id}:
 *   patch:
 *     summary: Update a loan
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Loan ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               borrowerName:
 *                 type: string
 *               loanAmount:
 *                 type: number
 *               interestRate:
 *                 type: number
 *               loanTerm:
 *                 type: number
 *               paymentDueDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Loan updated successfully
 *       404:
 *         description: Loan not found
 *       401:
 *         description: Unauthorized
 */
router.patch(
  "/:id",
  auth,
  idValidator,
  updateLoanValidators,
  validate,
  loanController.updateLoan
);

/**
 * @swagger
 * /api/loans/{id}:
 *   delete:
 *     summary: Delete a loan
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Loan ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Loan deleted successfully
 *       404:
 *         description: Loan not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", auth, idValidator, validate, loanController.deleteLoan);

/**
 * @swagger
 * /api/loans/{id}/status:
 *   patch:
 *     summary: Update the status of a loan
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Loan ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Approved, Rejected]
 *     responses:
 *       200:
 *         description: Loan status updated successfully
 *       404:
 *         description: Loan not found
 *       401:
 *         description: Unauthorized
 */
router.patch(
  "/:id/status",
  auth,
  idValidator,
  updateLoanStatusValidators,
  validate,
  loanController.updateLoanStatus
);

module.exports = router;
