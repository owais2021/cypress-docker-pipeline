class AmazonHomePage {


    // Actions
    visit() {
        cy.visit(Cypress.config("baseUrl"));// Navigate to URL
      }

    // Locators
    searchBox() {
      return cy.get('#twotabsearchtextbox');  // The search box element
    }
  
    searchButton() {
      return cy.get('#nav-search-submit-button');  // The search button element
    }
  
    
    searchProduct(productName) {
      this.searchBox().type(productName);  // Type the product name in the search box
      this.searchButton().click();  // Click the search button
    }
  }
  
  export default AmazonHomePage;
  