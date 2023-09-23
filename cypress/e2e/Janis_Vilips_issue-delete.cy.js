describe('Issue Deletion Test Suite', () => {
    beforeEach(() => {
      // Open the first issue from the board.
      cy.visit('/');
      cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
        cy.visit(url + '/board');
        cy.contains('This is an issue of type: Task.').click();
    });
});
})
  
describe('Test Case 1: Issue Deletion', () => {    
it('Should delete an issue and validate it successfully', () => {
    // Click the trash icon to initiate issue deletion
  cy.get('[data-testid="icon:trash"]').click();

    // Confirm the deletion by selecting "Delete issue"
  cy.contains('Delete issue').click();

    // Wait for the deletion to complete, and then reload the page
  cy.wait(1000); // Adjust the wait time as needed
  cy.reload();

    // Ensure that the backlog board is visible and contains only one item
  cy.get('[data-testid="board-list:backlog"]').should('be.visible').and('have.length', '1').within(() => {
    // Verify that there are now only three issues in the list after deletion
    cy.get('[data-testid="list-issue"]').should('have.length', '3');
  });
});
})

describe('Test Case 2: Issue Deletion Cancellation', () => {
    it('Should cancel deletion of an issue and validate it successfully', () => {

    // Delete an issue by pressing the trash icon
cy.get('[data-testid="modal:issue-details"]').within(() => {
    cy.get('[data-testid="icon:trash"]').click()
  })
  
    // Simulate an undo action by pressing "Undo" within a notification
  cy.get('[data-testid="notification"]').contains('Issue deleted. Undo').click()
  
     // Wait for the notification to disappear
  cy.get('[data-testid="notification"]').should('not.exist')
  
    // Close the issue window
  cy.get('[data-testid="modal:issue-details"]').within(() => {
    cy.get('[data-testid="icon:close"]').first().click()
  })
  
    // Assert that the issue is not deleted and the list contains 4 issues
  cy.reload()
  cy.get('[data-testid="board-list:backlog"]').should('be.visible').and('have.length', 1).within(() => {
    cy.get('[data-testid="list-issue"]').should('have.length', 4)
  })

        })
    })
  
  
        
      
      
    
  