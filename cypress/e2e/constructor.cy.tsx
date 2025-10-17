const apiBaseUrl = Cypress.env('apiBaseUrl');

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
        cy.contains('[data-cy=ingredient-card]', 'Биокотлета из марсианской Магнолии')
        .within(() => {
            cy.contains('button', 'Добавить').click({ force: true });
        });

        cy.get('[data-cy=constructor-item]')
        .should('contain.text', 'Биокотлета из марсианской Магнолии');
    });

    it('добавляет булку и начинку в конструктор', () => {
        cy.contains('[data-cy=ingredient-card]', 'Краторная булка N-200i')
        .within(() => {
            cy.contains('button', 'Добавить').click({ force: true });
        });

        cy.contains('[data-cy=ingredient-card]', 'Биокотлета из марсианской Магнолии')
        .within(() => {
            cy.contains('button', 'Добавить').click({ force: true });
        });

        cy.get('[data-cy=constructor-bun-top]')
        .should('contain.text', 'Краторная булка N-200i');
        cy.get('[data-cy=constructor-bun-bottom]')
        .should('contain.text', 'Краторная булка N-200i');

        cy.get('[data-cy=constructor-item]')
        .should('contain.text', 'Биокотлета из марсианской Магнолии');
    });

    describe('работа модальных окон', () => {
        it('открывает и закрывает модалку по крестику', () => {
            cy.contains('[data-cy=ingredient-card]', 'Краторная булка N-200i').click();

            cy.get('[data-cy=modal]')
            .should('be.visible')
            .and('contain.text', 'Краторная булка N-200i');

            cy.get('[data-cy=modal-close]').click();

            cy.get('[data-cy=modal]').should('not.exist');
        });

        it('закрывает модалку по оверлею', () => {
            cy.contains('[data-cy=ingredient-card]', 'Биокотлета из марсианской Магнолии').click();
        
            cy.get('[data-cy=modal]')
            .should('be.visible')
            .and('contain.text', 'Биокотлета из марсианской Магнолии');

            cy.get('[data-cy=modal-overlay]').click({ force: true });
        
            cy.get('[data-cy=modal]').should('not.exist');
        });

        it('закрывает модалку по клавише Esc', () => {
            cy.contains('[data-cy=ingredient-card]', 'Краторная булка N-200i').click();

            cy.get('[data-cy=modal]')
            .should('be.visible')
            .and('contain.text', 'Краторная булка N-200i');

            cy.get('body').type('{esc}');

            cy.get('[data-cy=modal]').should('not.exist');
        })
    });

    describe('создание заказа', () => {
        it('создаёт заказ и очищает конструктор после закрытия модалки', () => {
            cy.contains('[data-cy=ingredient-card]', 'Краторная булка N-200i')
            .within(() => {
                cy.contains('button', 'Добавить').click();
            });

            cy.contains('[data-cy=ingredient-card]', 'Биокотлета из марсианской Магнолии')
            .within(() => {
                cy.contains('button', 'Добавить').click();
            });

            cy.contains('button', 'Оформить заказ').click();

            cy.wait('@createOrder');

            cy.get('[data-cy=modal]').should('be.visible');
            cy.get('[data-cy=order-number]').should('contain.text', '12345');

            cy.get('[data-cy=modal-close]').click();
            cy.get('[data-cy=modal]').should('not.exist');

            cy.get('[data-cy=constructor-item]').should('have.length', 0);
            cy.get('[data-cy=burger-constructor]').should('contain.text', 'Выберите булки');
            cy.get('[data-cy=burger-constructor]').should('contain.text', 'Выберите начинку');
        });
        afterEach(() => {
            cy.clearCookies();
            cy.window().then((win) => win.localStorage.clear());
        });
    });
});