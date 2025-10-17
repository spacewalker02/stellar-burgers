import commands from '../support';

const apiBaseUrl = Cypress.env('apiBaseUrl');

const ingredientCard = '[data-cy=ingredient-card]';
const burgerConstructor = '[data-cy=burger-constructor]';
const constructorItem = '[data-cy=constructor-item]';
const constructorBunTop = '[data-cy=constructor-bun-top]';
const constructorBunBottom = '[data-cy=constructor-bun-bottom]';
const modal = '[data-cy=modal]';
const modalClose = '[data-cy=modal-close]';
const modalOverlay = '[data-cy=modal-overlay]';
const orderNumber = '[data-cy=order-number]';

describe('Конструктор бургера', () => {
    beforeEach(() => {
        cy.intercept('GET', `${apiBaseUrl}/ingredients`, {
            fixture: 'ingredients.json'
        }).as('getIngredients');

        cy.intercept('GET', `${apiBaseUrl}/auth/user`, {
            fixture: 'user.json'
        }).as('getUser');

        cy.intercept('POST', `${apiBaseUrl}/orders`, {
            fixture: 'order.json'
        }).as('createOrder');

        cy.visit('/', {
            onBeforeLoad(win) {
                win.localStorage.setItem('refreshToken', 'test-refresh-token');
                win.document.cookie = 'accessToken=Bearer test-access-token';
            }
        });

        cy.wait('@getIngredients');
        cy.wait('@getUser');
    });
    
    it('добавляет один ингредиент в конструктор', () => {
        cy.addIngredient('Биокотлета из марсианской Магнолии');

        cy.get(constructorItem)
        .should('contain.text', 'Биокотлета из марсианской Магнолии');
    });

    it('добавляет булку и начинку в конструктор', () => {
        cy.addIngredient('Краторная булка N-200i');
        cy.addIngredient('Биокотлета из марсианской Магнолии');

        cy.get(constructorBunTop)
        .should('contain.text', 'Краторная булка N-200i');
        cy.get(constructorBunBottom)
        .should('contain.text', 'Краторная булка N-200i');

        cy.get(constructorItem)
        .should('contain.text', 'Биокотлета из марсианской Магнолии');
    });

    describe('работа модальных окон', () => {
        it('открывает и закрывает модалку по крестику', () => {
            cy.openIngredientModal('Краторная булка N-200i');
            cy.closeModalByCross();
        });

        it('закрывает модалку по оверлею', () => {
            cy.openIngredientModal('Биокотлета из марсианской Магнолии');
            cy.closeModalByOverlay();
        });

        it('закрывает модалку по клавише Esc', () => {
            cy.openIngredientModal('Краторная булка N-200i');
            cy.closeModalByEsc();
        })
    });

    describe('создание заказа', () => {
        it('создаёт заказ и очищает конструктор после закрытия модалки', () => {
            cy.addIngredient('Краторная булка N-200i');
            cy.addIngredient('Биокотлета из марсианской Магнолии');

            cy.createOrder();
            cy.get(orderNumber).should('contain.text', '12345');

            cy.closeModalByCross();
            cy.get(constructorItem).should('have.length', 0);
            cy.get(burgerConstructor).should('contain.text', 'Выберите булки');
            cy.get(burgerConstructor).should('contain.text', 'Выберите начинку');
        });
        afterEach(() => {
            cy.clearCookies();
            cy.window().then((win) => win.localStorage.clear());
        });
    });
});