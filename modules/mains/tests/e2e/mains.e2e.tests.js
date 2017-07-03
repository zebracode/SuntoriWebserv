'use strict';

describe('Mains E2E Tests:', function () {
  describe('Test mains page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3000/mains');
      expect(element.all(by.repeater('main in mains')).count()).toEqual(0);
    });
  });
});
