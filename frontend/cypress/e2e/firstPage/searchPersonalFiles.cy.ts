import { mockEmployee } from 'cypress/fixtures/mockEmployee';
import { mockMe } from 'cypress/fixtures/mockMe';

describe('Search personal files', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/me', mockMe);
    cy.visit('http://localhost:3000/sok-personakt');
    cy.get('.sk-cookie-consent-btn-wrapper').contains('Godkänn alla').click();
  });

  it('displays the logged in users initials', () => {
    const initials = 'MT';
    cy.get('[data-cy=usermenu] span').contains(initials).should('exist');
  });

  it('displays the searchField and searches personal file', () => {
    cy.intercept('GET', `**/portalpersondata/**/employeeUsersEmployments`, mockEmployee).as('getEmployeeData');
    cy.get('[data-cy="searchfield-personalfiles"][placeholder="Skriv personnummer"]').should('exist');
    cy.get('[data-cy="searchfield-personalfiles"][placeholder="Skriv personnummer"]').type('19820202-1234');
    cy.get('button.sk-search-field-button-reset').should('exist');
    cy.get('button.sk-search-field-button-search').contains('Sök').should('exist').click();

    cy.wait('@getEmployeeData');

    cy.get('[data-cy="personalfile-result-table"]').should('exist');

    const columns = ['name', 'personnumber', 'numberofemployments'];
    columns.forEach((c) => {
      let value;
      if (c === columns[0]) value = `${mockEmployee.data[0].givenname} ${mockEmployee.data[0].lastname}`;
      if (c === columns[1]) value = `${mockEmployee.data[0].personNumber}`;
      if (c === columns[2]) value = `${mockEmployee.data[0].employments.length} st`;

      cy.get(`[data-cy="pf-${c}"]`).contains(value).should('exist');
    });
    cy.get(`[data-cy="pf-openbutton"] button`).contains('Öppna personakt').should('exist');
  });

  it('Returns error message if no personal file', () => {
    cy.get('[data-cy="searchfield-personalfiles"][placeholder="Skriv personnummer"]').type('19990202-5678');
    cy.get('button.sk-search-field-button-search').contains('Sök').should('exist').click();
    cy.get('.sk-snackbar-error .sk-snackbar-content span')
      .contains('Det gick inte att hitta någon personakt under det här personnumret')
      .should('exist');
    cy.get('button.sk-search-field-button-reset').should('exist').click();
  });
});
