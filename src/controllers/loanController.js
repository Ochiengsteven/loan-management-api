const Loan = require("../models/loanModel");

exports.createLoan = async (req, res) => {
  try {
    const loan = new Loan({
      ...req.body,
      createdBy: req.user._id,
    });
    await loan.save();
    res.status(201).send(loan);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ createdBy: req.user._id });
    res.send(loans);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getLoan = async (req, res) => {
  try {
    const loan = await Loan.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!loan) {
      return res.status(404).send();
    }
    res.send(loan);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateLoan = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "borrowerName",
    "loanAmount",
    "interestRate",
    "loanTerm",
    "paymentDueDate",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const loan = await Loan.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!loan) {
      return res.status(404).send();
    }

    updates.forEach((update) => (loan[update] = req.body[update]));
    await loan.save();
    res.send(loan);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteLoan = async (req, res) => {
  try {
    const loan = await Loan.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!loan) {
      return res.status(404).send();
    }
    res.send({ message: "Loan has been deleted successfully", loan });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.calculateLoan = (req, res) => {
  try {
    const { loanAmount, interestRate, loanTerm } = req.body;

    if (!loanAmount || !interestRate || !loanTerm) {
      return res.status(400).send({
        error: "Please provide loanAmount, interestRate, and loanTerm",
      });
    }

    const monthlyInterestRate = interestRate / 100 / 12;
    const monthlyPayment =
      (loanAmount * monthlyInterestRate) /
      (1 - Math.pow(1 + monthlyInterestRate, -loanTerm));
    const totalRepayment = monthlyPayment * loanTerm;

    res.send({
      monthlyPayment: monthlyPayment.toFixed(2),
      totalRepayment: totalRepayment.toFixed(2),
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

exports.updateLoanStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Approved", "Pending", "Rejected"].includes(status)) {
      return res.status(400).send({ error: "Invalid status" });
    }

    const loan = await Loan.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!loan) {
      return res.status(404).send();
    }

    loan.loanStatus = status;
    await loan.save();
    res.send(loan);
  } catch (error) {
    res.status(400).send(error);
  }
};
