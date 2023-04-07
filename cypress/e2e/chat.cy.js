describe("start chatting", () => {
    it("login and start chatting", () => {
        Cypress.on('uncaught:exception', () => false)

        cy.visit("https://langchat.onrender.com/home")
        cy.contains("Login").click();
        cy.get("input[placeholder=\"Username\"]").type("test");
        cy.get("input[placeholder=\"Password\"]").type("test");
        cy.contains("Login").click();
        cy.contains("Reading").click();
        cy.contains("Sports").click();
        cy.contains("Start Chatting").click();
        cy.wait(2000)
        cy.contains("Back to Dashboard").click();
    })
})