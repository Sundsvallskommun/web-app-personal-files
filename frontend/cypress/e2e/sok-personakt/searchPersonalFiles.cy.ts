/// <reference types="cypress" />

import { mockEmployee } from 'cypress/fixtures/mockEmployee';
import { mockMe } from 'cypress/fixtures/mockMe';

describe('Serach personal files', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/me', mockMe);
    cy.visit('http://localhost:3000/sok-personakt');

    cy.get('.sk-cookie-consent-btn-wrapper').contains('Godkänn alla').click();
  });

  it('Displays the logged in users initials', () => {
    const initials = 'MT';
    cy.get('[data-cy=usermenu] span').contains(initials).should('exist');
  });

  it('Displays the searchField and searches personal file', () => {
    cy.intercept('GET', `**/portalpersondata/**/loginname`, mockEmployee).as('getLogin');
    cy.intercept('GET', `**/portalpersondata/personal/**`, mockEmployee);
    cy.intercept('GET', `**/portalpersondata/**/employeeUsersEmployments`, mockEmployee);

    cy.get('[data-cy="searchfield-personalfiles"][placeholder="Skriv personnummer"]').should('exist');
    cy.get('[data-cy="searchfield-personalfiles"][placeholder="Skriv personnummer"]').type('198104197838');
    cy.get('button.sk-search-field-button-reset').should('exist');
    cy.get('button.sk-search-field-button-search').contains('Sök').should('exist').click();

    cy.wait('@getLogin');

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

  it('Displays info message when typing wrong or too short search value for person number', () => {
    cy.get('[data-cy="searchfield-personalfiles"][placeholder="Skriv personnummer"]').type('ABCD');
    cy.get('div.sk-form-error-message')
      .should('exist')
      .contains('Personnumret måste innehålla siffror och efterlikna följande struktur: ååååmmddnnnn');
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
