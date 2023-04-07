describe("register", () => {
    it("opens the register page", () => {
        Cypress.on('uncaught:exception', () => false)

        cy.visit("http://localhost:3000/home")
        cy.contains("Register").click();
    })
})