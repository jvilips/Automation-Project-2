import { faker } from '@faker-js/faker';

describe('Time tracking', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`)
  });

  const createIssue = (title) => {
  const description = faker.lorem.paragraph();
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get('[data-testid="form-field:description"]').type(description);
      cy.get('input[name="title"]').type(title);
      cy.get('button[type="submit"]').click();
    });
  };

  const openTimeTracking = () => cy.get('[data-testid="icon:stopwatch"]');
  const getEstimation = () => cy.get('[data-testid="icon:stopwatch"]').next();
  const getTimeTrackingModal = () => cy.get('[data-testid="modal:tracking"]');

  it('Add, update, and remove time estimates', () => {
    cy.visit('/board?modal-issue-create=true');
    const title = faker.lorem.word().charAt(0).toUpperCase() + faker.lorem.word().slice(1);
    createIssue(title);

    cy.contains(title).click();
    cy.get('[placeholder="Number"]').type('4');
    getEstimation().should('contain', '4h estimated');

    cy.get('[placeholder="Number"]').clear().type('8');
    getEstimation().should('contain', '8h estimated');

    cy.get('[placeholder="Number"]').clear();
    getEstimation().should('not.contain', '8h estimated').and('contain', 'No time logged');
  });

  it('Log, edit, and delete time', () => {
    cy.contains('This is an issue of type: Task.').click();
    openTimeTracking().trigger('click');
    getTimeTrackingModal().within(() => {
      cy.get('[placeholder="Number"]').first().clear().type('4');
    });
    cy.contains('button', 'Done').click().should('not.exist');
    getTimeTrackingModal().should('not.exist');
    openTimeTracking().next().should('contain', '4h logged');

    openTimeTracking().trigger('click');
    getTimeTrackingModal().within(() => {
      cy.get('[placeholder="Number"]').first().clear().type('8');
    });
    cy.contains('button', 'Done').click().should('not.exist');
    getTimeTrackingModal().should('not.exist');
    openTimeTracking().next().should('contain', '8h logged');

    openTimeTracking().trigger('click');
    getTimeTrackingModal().within(() => {
      cy.get('[placeholder="Number"]').first().clear();
    });
    cy.contains('button', 'Done').click().should('not.exist');
    getTimeTrackingModal().should('not.exist');
    openTimeTracking().next().should('contain', 'No time logged');
  });

  it('Add time estimation and log actual time', () => {
    const estimatedHours = 7;
    const loggedTime = 3;

    cy.contains('This is an issue of type: Task.').click();
    cy.get('[placeholder="Number"]').clear().type(estimatedHours);
    getEstimation().should('contain', `${estimatedHours}h estimated`);

    openTimeTracking().trigger('click');
    getTimeTrackingModal().within(() => {
      cy.get('[placeholder="Number"]').first().clear().type(loggedTime);
    });
    cy.contains('button', 'Done').click().should('not.exist');
    getTimeTrackingModal().should('not.exist');
    openTimeTracking().next().should('contain', `${loggedTime}h logged`);
  });
});
