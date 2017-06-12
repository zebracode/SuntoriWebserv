'use strict';

describe('Recipients E2E Tests:', function () {
  describe('Test recipients page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3000/recipients');
      expect(element.all(by.repeater('recipient in recipients')).count()).toEqual(0);
    });
  });
});
