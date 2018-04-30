'use strict';

describe('Statements E2E Tests:', function () {
  describe('Test Statements page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/statements');
      expect(element.all(by.repeater('statement in statements')).count()).toEqual(0);
    });
  });
});
