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
            content: ''
        },
        {
            name: 'ประวัติการใช้งาน',
            avatar: 'logo',
            content: 'Zombie ipsum reversus ab viral inferno, nam rick grimes malum cerebro. De carne lumbering animata corpora quaeritis. Summus brains sit​​, morbo vel maleficia? De apocalypsi gorger omero undead survivor dictum mauris.'
        },
        {
            name: 'เพิ่มรายการ',
            avatar: 'logo',
            content: 'Raw denim pour-over readymade Etsy Pitchfork. Four dollar toast pickled locavore bitters McSweeneys blog. Try-hard art party Shoreditch selfies. Odd Future butcher VHS, disrupt pop-up Thundercats chillwave vinyl jean shorts taxidermy master cleanse letterpress Wes Anderson mustache Helvetica. Schlitz bicycle rights chillwave irony lumberhungry Kickstarter next level sriracha typewriter Intelligentsia, migas kogi heirloom tousled. Disrupt 3 wolf moon lomo four loko. Pug mlkshk fanny pack literally hoodie bespoke, put a bird on it Marfa messenger bag kogi VHS.'
        },
        {
            name: 'รายชื่อผู้รับ',
            avatar: 'logo',
            content: 'Scratch the furniture spit up on light gray carpet instead of adjacent linoleum so eat a plant, kill a hand pelt around the house and up and down stairs chasing phantoms run in circles, or claw drapes. Always hungry pelt around the house and up and down stairs chasing phantoms.'
        },
        {
            name: 'รายชื่อผู้ส่ง',
            avatar: 'logo',
            content: 'Webtwo ipsum dolor sit amet, eskobo chumby doostang bebo. Bubbli greplin stypi prezi mzinga heroku wakoopa, shopify airbnb dogster dopplr gooru jumo, reddit plickers edmodo stypi zillow etsy.'
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