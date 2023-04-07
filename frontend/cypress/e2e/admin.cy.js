describe("admin", () => {
    it("test admin page", () => {
        Cypress.on('uncaught:exception', () => false)

        cy.visit("http://localhost:3000/home")
        cy.contains("Login").click();
        cy.get("input[placeholder=\"Username\"]").type("alex501212");
        cy.get("input[placeholder=\"Password\"]").type("test");
        cy.contains("Login").click();
        cy.visit("http://localhost:3000/admin")
        cy.contains("test").click();
        cy.contains("View All User Reports").click();
        cy.contains("Cancel").click();
    })
})