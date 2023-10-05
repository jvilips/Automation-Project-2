describe('Issue comments creating, editing and deleting', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board');
            cy.contains('This is an issue of type: Task.').click();
        });
    });

    const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');

    it('Should create, edit, and delete a comment successfully', () => {
            const originalComment = 'An old silent pond...';
            const newComment = 'TEST_COMMENT';
            const editedComment = 'TEST_COMMENT_EDITED';
    
            // Add a comment
            cy.contains('Add a comment...')
                .click();
            cy.get('textarea[placeholder="Add a comment..."]').type(newComment);
            cy.contains('button', 'Save')
                .click()
                .should('not.exist');
            cy.contains('Add a comment...').should('exist');
            cy.get('[data-testid="issue-comment"]').should('contain', newComment);
    
            // Edit the added comment
            cy.get('[data-testid="issue-comment"]')
                .contains(originalComment)
            cy.contains('Edit')
                .click()
                .should('not.exist');
            cy.get('textarea[placeholder="Add a comment..."]')
                .should('not.contain', originalComment)
                .clear()
                .type(editedComment);
            cy.contains('button', 'Save')
                .click()
                .should('not.exist');
            cy.get('[data-testid="issue-comment"]')
                .should('contain', 'Edit')
                .and('contain', editedComment);
    
            // Delete the edited comment
            cy.get('[data-testid="issue-comment"]')
                .contains(editedComment)
            cy.contains('Delete')
                .click();
    
            cy.get('[data-testid="modal:confirm"]')
                .contains('button', 'Delete comment')
                .click()
                .should('not.exist');
    
            
        });
    })
    
    