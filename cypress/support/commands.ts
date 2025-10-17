/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// команда для добавления ингредиента в конструктор
    Cypress.Commands.add('addIngredient', (name: string) => {
        cy.contains('[data-cy=ingredient-card]', name)
        .within(() => {
            cy.contains('button', 'Добавить').click({ force: true });
        });
    });

// команда для открытия модалки ингредиента
    Cypress.Commands.add('openIngredientModal', (name: string) => {
        cy.contains('[data-cy=ingredient-card]', name).click();
        cy.get('[data-cy=modal]')
        .should('be.visible')
        .and('contain.text', name);
    });

// команда, чтобы закрыть модалку по крестику
    Cypress.Commands.add('closeModalByCross', () => {
        cy.get('[data-cy=modal-close]').click();
        cy.get('[data-cy=modal]').should('not.exist');
    });

// команда: закрыть модалку по оверлею
    Cypress.Commands.add('closeModalByOverlay', () => {
        cy.get('[data-cy=modal-overlay]').click({ force: true });
        cy.get('[data-cy=modal]').should('not.exist');
    });
  
// команда: закрыть модалку по ESC
    Cypress.Commands.add('closeModalByEsc', () => {
        cy.get('body').type('{esc}');
        cy.get('[data-cy=modal]').should('not.exist');
    });
  
// команда: оформить заказ
    Cypress.Commands.add('createOrder', () => {
        cy.contains('button', 'Оформить заказ').click();
        cy.wait('@createOrder');
        cy.get('[data-cy=modal]').should('be.visible');
  });
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }