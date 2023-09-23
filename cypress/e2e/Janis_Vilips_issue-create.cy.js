import { faker } from '@faker-js/faker';

describe('Issue create', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
    //System will already open issue creating modal in beforeEach block  
    cy.visit(url + '/board?modal-issue-create=true');
    });
  });

  it('Should create an issue and validate it successfully', () => {
    //System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      
      //open issue type dropdown and choose Story
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Story"]')
          .trigger('click');
            
      //Type value to description input field
      cy.get('.ql-editor').type('TEST_DESCRIPTION');

      //Type value to title input field
      //Order of filling in the fields is first description, then title on purpose
      //Otherwise filling title first sometimes doesn't work due to web page implementation
      cy.get('input[name="title"]').type('TEST_TITLE');
      
      //Select Lord Gaben from reporter dropdown
      cy.get('[data-testid="select:userIds"]').click();
      cy.get('[data-testid="select-option:Lord Gaben"]').click();

      //Click on button "Create issue"
      cy.get('button[type="submit"]').click();
    });

    //Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');
    
    //Reload the page to be able to see recently created issue
    //Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    //Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {
      //Assert that this list contains 5 issues and first element with tag p has specified text
      cy.get('[data-testid="list-issue"]')
          .should('have.length', '5')
          .first()
          .find('p')
          .contains('TEST_TITLE');
      //Assert that correct avatar and type icon are visible
      cy.get('[data-testid="avatar:Lord Gaben"]').should('be.visible');
      cy.get('[data-testid="icon:story"]').should('be.visible');
    });
  });

  it('Should validate title is required field if missing', () => {
    //System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      //Try to click create issue button without filling any data
      cy.get('button[type="submit"]').click();

      //Assert that correct error message is visible
      cy.get('[data-testid="form-field:title"]').should('contain', 'This field is required');
    });
  });

  describe('Test Case 1: Custom Issue Creation', () => {
    it('Should create a custom issue and validate it', () => {
        
      // Fill in the issue creation form for a custom issue.
      cy.get('[data-testid="modal:issue-create"]').within(() => {
        cy.get('.ql-editor').type('My bug description');
        cy.get('input[name="title"]').type('Bug');
  
        // Select the issue type as "Bug."
        cy.get('[data-testid="select:type"]').click();
        cy.get('[data-testid="select-option:Bug"]')
          .trigger('click');
  
        // Select the priority as "Highest."
        cy.get('[data-testid="select:priority"]').click();
        cy.get('[data-testid="select-option:Highest"]').click();
  
        // Select the reporter as "Pickle Rick."
        cy.get('[data-testid="select:reporterId"]').click();
        cy.get('[data-testid="select-option:Pickle Rick"]').click();
  
        // Submit the form to create the custom issue.
        cy.get('button[type="submit"]').click();
      });
  
      // Assert that the issue creation modal is closed and the success message is visible..
      cy.get('[data-testid="modal:issue-create"]').should('not.exist');
      cy.contains('Issue has been successfully created.').should('be.visible');
  
      // Reload the page to verify the created custom issue on the board.
      cy.reload();
  
      // Assert that the success message has disappeared.
      cy.contains('Issue has been successfully created.').should('not.exist');
  
      // Additional assertions specific to your application's board, if needed.
    });
  });

  describe('Test Case 2: Random Data Plugin Issue Creation', () => {
    it('Should create an issue with random data and validate it', () => {
       
      // Generate random data for the issue.
      const randomTitle = faker.lorem.word();
      const randomDescription = faker.lorem.words(5);
  
      // Fill in the issue creation form with random data.
      cy.get('[data-testid="modal:issue-create"]').within(() => {
        cy.get('.ql-editor').type(randomDescription);
        cy.get('input[name="title"]').type(randomTitle);
  
        // Select the issue type as "Task."
        cy.get('[data-testid="select:type"]').click();
        cy.get('[data-testid="icon:task"]')
        .trigger('click');
  
        // Select the priority as "Low."
        cy.get('[data-testid="select:priority"]').click();
        cy.get('[data-testid="select-option:Low"]').click();
  
        // Select the reporter as "Baby Yoda."
        cy.get('[data-testid="select:reporterId"]').click();
        cy.get('[data-testid="select-option:Baby Yoda"]').click();
  
        // Submit the form to create the issue with random data.
        cy.get('button[type="submit"]').click();
      });
  
      // Assert that the issue creation modal is closed.
      cy.get('[data-testid="modal:issue-create"]').should('not.exist');
  
      // Assert that the success message is visible.
      cy.contains('Issue has been successfully created.').should('be.visible');
  
      // Reload the page to verify the created issue with random data on the board.
      cy.reload();
  
      // Assert that the success message has disappeared.
      cy.contains('Issue has been successfully created.').should('not.exist');
  
    });
  });
  
});