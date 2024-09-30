const request = require("supertest");
const app = require("../app");

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmZhYjI4NWY5ZjQ1MWE2N2ZkNjU3NmIiLCJpYXQiOjE3Mjc3MDU4MTJ9.bUrxE4TiMR_bWW-DM3O00ogTrwZ32LuPS9fW26-TIYk";

describe("Loan Calculation", () => {
  it("should calculate monthly payment and total repayment", async () => {
    const response = await request(app)
      .post("/api/loans/calculate")
      .send({
        loanAmount: 10000,
        interestRate: 5,
        loanTerm: 12,
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("monthlyPayment");
    expect(response.body).toHaveProperty("totalRepayment");
  });

  it("should return 400 for invalid input", async () => {
    const response = await request(app)
      .post("/api/loans/calculate")
      .send({
        loanAmount: "invalid", // Invalid input
        interestRate: 5,
        loanTerm: 12,
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined(); // Check for errors array
    expect(response.body.errors[0]).toHaveProperty(
      "msg",
      "Loan amount must be a number"
    ); // Check specific error message
  });
});
