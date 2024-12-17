import { mockEmployee } from 'cypress/fixtures/mockEmployee';
import { mockMe } from 'cypress/fixtures/mockMe';
import { mockCompanies, mockDocTypes, mockDocuments, mockFormOfEmployment } from 'cypress/fixtures/mockPersonFile';

describe('Personal file', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/me', mockMe);
    cy.visit('http://localhost:3000/sok-personakt');

    cy.get('.sk-cookie-consent-btn-wrapper').contains('Godkänn alla').click();

    cy.intercept('GET', `**/portalpersondata/**/loginname`, mockEmployee).as('getLogin');
    cy.intercept('GET', `**/portalpersondata/personal/**`, mockEmployee);
    cy.intercept('GET', `**/portalpersondata/**/employeeUsersEmployments`, mockEmployee);

    cy.get('[data-cy="searchfield-personalfiles"][placeholder="Skriv personnummer"]').type('198104197838');
    cy.get('button.sk-search-field-button-reset').should('exist');
    cy.get('button.sk-search-field-button-search').contains('Sök').should('exist').click();

    cy.wait('@getLogin');

    cy.get('[data-cy="personalfile-result-table"]').should('exist');

    cy.get(`[data-cy="pf-openbutton"] button`).contains('Öppna personakt').should('exist').click();

    cy.intercept('GET', `**/document/types`, mockDocTypes).as('getTypes');
    cy.intercept('GET', `**/companies`, mockCompanies).as('getCompanies');
    cy.intercept('GET', `**/formofemployments`, mockFormOfEmployment).as('getEmpForm');
    cy.intercept('POST', `**/document/search`, mockDocuments).as('getDocs');

    cy.wait('@getTypes');
    cy.wait('@getCompanies');
    cy.wait('@getEmpForm');
    cy.wait('@getDocs');
  });

  it('Displays the employment information', () => {
    cy.get('.sk-table-wrapper .sk-table-col-content').contains(mockEmployee.data[0].employments[0].title);
    cy.get('.sk-table-wrapper .sk-table-tbody-td .sk-label')
      .first()
      .contains(mockEmployee.data[0].employments[0].title);
    cy.get('.sk-table-wrapper .sk-table-tbody-td .sk-label')
      .last()
      .contains(
        mockFormOfEmployment.data.find((x) => x.foeId === mockEmployee.data[0].employments[0].formOfEmploymentId)
          .description
      );
    cy.get('.sk-table-wrapper .sk-table-tbody-td p')
      .eq(0)
      .contains(
        mockCompanies.data.find((x) => x.companyId === mockEmployee.data[0].employments[0].companyId).displayName
      );
    cy.get('.sk-table-wrapper .sk-table-tbody-td p').eq(1).contains(mockEmployee.data[0].employments[0].topOrgName);
    cy.get('.sk-table-wrapper .sk-table-tbody-td p').eq(2).contains(mockEmployee.data[0].employments[0].orgName);
  });

  it('Can select and change employment to show', () => {
    cy.get('select[data-cy="selectemployment"]').should('exist').select(mockEmployee.data[0].employments[1].title);

    cy.get('.sk-table-wrapper .sk-table-col-content').contains(mockEmployee.data[0].employments[1].title);
    cy.get('.sk-table-wrapper .sk-table-tbody-td .sk-label')
      .last()
      .contains(
        mockFormOfEmployment.data.find((x) => x.foeId === mockEmployee.data[0].employments[1].formOfEmploymentId)
          .description
      );
    cy.get('.sk-table-wrapper .sk-table-tbody-td p')
      .eq(0)
      .contains(
        mockCompanies.data.find((x) => x.companyId === mockEmployee.data[0].employments[1].companyId).displayName
      );
    cy.get('.sk-table-wrapper .sk-table-tbody-td p').eq(1).contains(mockEmployee.data[0].employments[1].topOrgName);
    cy.get('.sk-table-wrapper .sk-table-tbody-td p').eq(2).contains(mockEmployee.data[0].employments[1].orgName);
  });

  it('Can list documents', () => {
    const docIndex = [0, 1, 2];
    cy.get('.sk-table-wrapper').should('exist');
    cy.get('.sk-table-wrapper [data-cy="document-list"]').should('exist');
    docIndex.forEach((index) => {
      cy.get(`.sk-table-wrapper [data-cy="document-${index}"]`).should('exist');
    });
  });

  it('Can dowmload pdf document', () => {
    cy.intercept('GET', '**/document/2024-2281-56/files/4c2f0579-5b19-43de-8d53-7b1351835fae', {}).as('getDocument');
    cy.get(`.sk-table-wrapper [data-cy="document-0"] button.sk-btn-primary`).should('exist').click();
    cy.get('.sk-popup-menu').should('exist');
    cy.get('.sk-popup-menu .sk-popup-menu-group button').should('exist').contains('Öppna').click();
    cy.wait('@getDocument');
  });

  it.only('Can delete document', () => {
    cy.intercept('DELETE', '**/document/2024-2281-56/files/4c2f0579-5b19-43de-8d53-7b1351835fae', {}).as(
      'deleteDocument'
    );
    cy.get(`.sk-table-wrapper [data-cy="document-0"] button.sk-btn-primary`).should('exist').click();
    cy.get('.sk-popup-menu').should('exist');
    cy.get('.sk-popup-menu .sk-popup-menu-group button').should('exist').contains('Ta bort').click();
    cy.get('.sk-modal-dialog').should('exist');
    cy.get('.sk-modal-dialog .sk-modal-footer button.sk-btn-primary').should('exist').contains('Ja').click();
    cy.wait('@deleteDocument');
    cy.intercept('POST', `**/document/search`, mockDocuments);
  });

  it('Can upload document', () => {
    cy.intercept('POST', `**/document/upload`, 'testfile.pdf').as('uploadDocument');
    cy.get('button[data-cy="upload-document"]').should('exist').contains('Ladda upp').click();
    //wrong format
    cy.get('.sk-modal-content label div span.sk-link').should('exist').contains('Bläddra').click();
    cy.get('.sk-modal-content input[type=file]').selectFile('cypress/e2e/files/testImage.webp', { force: true });

    cy.get('.sk-modal-content .sk-form-error-message').should('exist').contains('Fel filtyp, välj en pdf');

    //right format
    cy.get('.sk-modal-content label div span.sk-link').should('exist').contains('Bläddra').click();
    cy.get('.sk-modal-content input[type=file]').selectFile('cypress/e2e/files/testfile.pdf', { force: true });
    mockDocTypes.data.forEach((type) => {
      cy.get('.sk-modal-content select').should('exist').select(type.displayName);
    });

    cy.get('.sk-modal-footer button.sk-btn-primary').should('exist').contains('Ladda upp').click();
    cy.wait('@uploadDocument');
    cy.intercept('POST', `**/document/search`, mockDocuments);
  });
});
