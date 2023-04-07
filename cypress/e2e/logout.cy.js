describe("logout", () => {
    it("login and logout the user", () => {
        Cypress.on('uncaught:exception', () => false)

        cy.visit("https://langchat.onrender.com/home")
        cy.contains("Login").click();
        cy.get("input[placeholder=\"Username\"]").type("test");
        cy.get("input[placeholder=\"Password\"]").type("test");
        cy.contains("Login").click();
        cy.contains("Logout").click();
    })
})