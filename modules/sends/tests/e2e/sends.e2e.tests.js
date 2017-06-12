'use strict';

describe('Sends E2E Tests:', function () {
  describe('Test sends page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3000/sends');
      expect(element.all(by.repeater('send in sends')).count()).toEqual(0);
    });
  });
});
