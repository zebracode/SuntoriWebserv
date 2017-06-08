'use strict';

describe('Creates E2E Tests:', function () {
  describe('Test Creates page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/creates');
      expect(element.all(by.repeater('create in creates')).count()).toEqual(0);
    });
  });
});
