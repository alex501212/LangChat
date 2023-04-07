describe("register", () => {
    it("opens the register page", () => {
        Cypress.on('uncaught:exception', () => false)

        cy.visit("https://langchat.onrender.com/home")
        cy.contains("Register").click();
    })
})