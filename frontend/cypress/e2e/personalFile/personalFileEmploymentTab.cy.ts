import { mockEmployee } from 'cypress/fixtures/mockEmployee';
import { mockMe } from 'cypress/fixtures/mockMe';

describe('Personal files employment', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/me', mockMe);
    cy.visit(`http://localhost:3000/sok-personakt/personakt/da25dba4-5c38-46a1-99b5-4f0ce597e65b`);
    cy.intercept('GET', `**/portalpersondata/**`, mockEmployee).as('getEmp');
    cy.wait('@getEmp');
    cy.get('.sk-cookie-consent-btn-wrapper').contains('Godkänn alla').click();
  });

  it('displays the logged in users initials', () => {
    const initials = 'MT';
    cy.get('[data-cy=usermenu] span').contains(initials).should('exist');
  });
});
