const request = require("supertest");
const app = require("../app");

describe("Loan CRUD Operations", () => {
  let loanId;
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmZhYjI4NWY5ZjQ1MWE2N2ZkNjU3NmIiLCJpYXQiOjE3Mjc3MDU4MTJ9.bUrxE4TiMR_bWW-DM3O00ogTrwZ32LuPS9fW26-TIYk"; // Replace with a valid token

  it("should create a new loan", async () => {
    const response = await request(app)
      .post("/api/loans")
      .send({
        borrowerName: "John Doe",
        loanAmount: 10000,
        interestRate: 5,
        loanTerm: 12,
        paymentDueDate: "2024-09-30",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("_id");
    loanId = response.body._id; // Store the loan ID for later tests
  });

  it("should get all loans", async () => {
    const response = await request(app)
      .get("/api/loans")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should get a specific loan by ID", async () => {
    const response = await request(app)
      .get(`/api/loans/${loanId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id", loanId);
  });

  it("should update a loan", async () => {
    const response = await request(app)
      .patch(`/api/loans/${loanId}`)
      .send({
        loanAmount: 12000,
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("loanAmount", 12000);
  });

  it("should delete a loan", async () => {
    const response = await request(app)
      .delete(`/api/loans/${loanId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Loan has been deleted successfully"
    );
  });
});
