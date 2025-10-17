const INGREDIENT_CATEGORY_BUNS = '[data-cy=ingredient-category-buns]';
const INGREDIENT_CATEGORY_MAINS = '[data-cy=ingredient-category-mains]';
const INGREDIENT_CATEGORY_SAUCES = '[data-cy=ingredient-category-sauces]';
const INGREDIENT_ITEM = '[data-cy=ingredient-item]';
const CONSTRUCTOR_BUN_TOP = '[data-cy=constructor-bun-top]';
const CONSTRUCTOR_BUN_BOTTOM = '[data-cy=constructor-bun-bottom]';
const CONSTRUCTOR_INGREDIENT = '[data-cy=constructor-ingredient]';
const MODAL = '[data-cy=modal]';
const MODAL_CLOSE = '[data-cy=modal-close]';
const ORDER_BUTTON = '[data-cy=order-button]';

describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.visit('/');
    
    // Настройка перехвата для всех тестов
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.wait('@getIngredients');
  });

  describe('Добавление ингредиентов', () => {
    it('Добавление булки в конструктор', () => {
      cy.get(INGREDIENT_CATEGORY_BUNS).get(INGREDIENT_ITEM).contains('Добавить').click();
      
      // Проверяем, что булка добавлена в конструктор
      cy.get(CONSTRUCTOR_BUN_TOP).contains('Краторная булка N-200i').should('exist');
      cy.get(CONSTRUCTOR_BUN_BOTTOM).contains('Краторная булка N-200i').should('exist');
    });
    it('Добавление ингредиента в конструктор', () => {
      cy.get(INGREDIENT_CATEGORY_MAINS).eq(0).contains('Добавить').click();

      cy.get(CONSTRUCTOR_INGREDIENT).contains('Биокотлета из марсианской Магнолии').should('exist');
    });
  });

  describe('Работа модальных окон', () => {
    it('Открытие и закрытие модального окна ингредиента', () => {
      // Открываем модальное окно
      cy.get(INGREDIENT_CATEGORY_BUNS).get(INGREDIENT_ITEM).eq(0).click();

      // Проверяем, что модальное окно открылось и отображаются детали ингредиента
      cy.get(MODAL).should('exist');
      
      // Проверяем, что в модальном окне отображаются детали именно того ингредиента, на который кликнули
      cy.get(MODAL).contains('Краторная булка N-200i');
      
      // Закрываем по крестику
      cy.get(MODAL_CLOSE).click();
      cy.get(MODAL).should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      // Мокаем получение пользователя
      cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
      
      // Мокаем создание заказа
      cy.intercept('POST', 'api/orders', { fixture: 'postOrder.json' }).as('createOrder');

      // Устанавливаем токены в localStorage и cookies для авторизации
      window.localStorage.setItem(
        'refreshToken',
        JSON.stringify('test-refreshToken')
      );
      cy.setCookie('accessToken', 'test-accessToken');

      // Переходим на нужный URL, чтобы cookies были установлены для правильного домена
      cy.visit('/');
    });

    afterEach(() => {
      // Очищаем localStorage и cookies после каждого теста
      cy.clearLocalStorage();
      cy.clearCookies();
    });

    it('Оформление заказа и отображение номера', () => {
      // Добавляем ингредиенты
      cy.get(INGREDIENT_CATEGORY_BUNS).get(INGREDIENT_ITEM).contains('Добавить').click();
      cy.get(INGREDIENT_CATEGORY_MAINS).get(INGREDIENT_ITEM).contains('Добавить').click();

      // Кликаем по кнопке "Оформить заказ"
      cy.get(ORDER_BUTTON).click();

      // Проверяем, что модальное окно открылось и отображается правильный номер
      cy.get(MODAL).should('exist');
      cy.get(MODAL).contains('123456');

      // Закрываем модальное окно
      cy.get(MODAL_CLOSE).click();
      cy.get(MODAL).should('not.exist');

      // Проверяем, что конструктор пуст
      cy.get(CONSTRUCTOR_BUN_TOP).should('not.exist');
      cy.get(CONSTRUCTOR_INGREDIENT).should('have.length', 0);
    });
  });
});