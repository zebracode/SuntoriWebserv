 'use strict';
angular.module('core').service('usersService', ['$q',
    function($q) {


    /**
     * Users DataService
     * Uses embedded, hard-coded data model; acts asynchronously to simulate
     * remote data service call(s).
     *
     * @returns {{loadAll: Function}}
     * @constructor
     */

    var users = [
        {
            name: 'หน้าหลัก',
            avatar: 'logo',
            content: 'รายละเอียดการใช้งานในหน้าหลัก'
        },
        {
            name: 'ประวัติการใช้งาน',
            avatar: 'logo',
            content: 'รายละเอียดการใช้งานในหน้าประวัติการใช้งาน'
        },
        {
            name: 'เพิ่มรายการ',
            avatar: 'logo',
            content: 'รายละเอียดการใช้งานในหน้าเพิ่มรายการ'
        },
        {
            name: 'รายชื่อผู้รับ',
            avatar: 'logo',
            content: 'รายละเอียการใช้งานในหน้ารายชื่อผู้รับ'
        },
        {
            name: 'รายชื่อผู้ส่ง',
            avatar: 'logo',
            content: 'รายละเอียดการใช้งานในหน้ารายชื่อผู้ส่ง'
        }
    ];

    // Promise-based API
    return {
        loadAll : function() {
            // Simulate async nature of real remote calls
            return $q.when(users);
        }
    };
}]);
