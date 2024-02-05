describe("template spec", () => {
  it("Render default home page on screen", () => {
    cy.visit("http://localhost:3000/");
    cy.get('.App').should("exist");
  });
});
