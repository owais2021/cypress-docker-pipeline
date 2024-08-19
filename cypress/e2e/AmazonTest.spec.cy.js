import AmazonHomePage from '../support/pages/AmazonHomePage';


describe('Amazon Product Search', () => {
  const amazonHomePage = new AmazonHomePage();

  beforeEach(function () {
    // Load the fixture data
    cy.fixture('productData').then(function (data) {
      this.data = data;
    });
  });

  
  it('should search for a product on Amazon', function () {
    
    amazonHomePage.visit();  // Go to Amazon
    amazonHomePage.searchProduct(this.data.productName);  // Use the product name from the fixture
    
    // Additional assertions
    cy.url().should('include', `k=${this.data.productName}`);  // Verify that the URL contains the search query
    cy.get('.s-search-results').should('be.visible');  // Verify that search results are visible
  });
});
