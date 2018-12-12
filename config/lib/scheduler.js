'use strict';

var cron = require('node-cron'),
    mongoose = require('mongoose');


/**
 * 1. Retrieve เฉพาะข้อมูลที่
 *    1.1 ยอดก่อนส่ง และหลังส่งไม่ได้เท่ากัน 
 *    1.2 สถานะเป็น "ปณ.ต้นทางรับฝากแล้ว"
 *    1.3 ยังไม่ได้สร้าง Statment ที่เกิดจากยอดส่วนต่าง (isCreateDiffStatment != true)
 * 2. Update ยอดเงินคงเหลือของ User
 *    3.1 ถ้าค่าส่งก่อน > ค่าส่งหลัง เพิ่มยอดคงเหลือ
 *    3.2 ถ้าค่าส่งก่อน < ค่าส่งหลัง ลดยอดคงเหลือ
 * 3. สร้าง Statement ของส่วนต่างค่าส่ง
 * 4. Update สถานะของรายการเป็นสร้าง Statment จากส่วนต่างแล้ว (isCreateDiffStatment <- true)
 */

var task = cron.schedule('* * * * *', function () {
    console.log("Schedule has been executed!!!");
    var Main = mongoose.model('Main');
    Main.findOne({
        barcode:{$ne:""},
        afterPrice: { $gt: 0 },
        status: {$ne: "ยังไม่ได้ชำระเงิน"},
        isCreateDiffStatment: { $eq: false }
    })
        .populate('user').exec(function (err, main) {
            if (!err && main) {
                console.log("main: ");
                console.log(main);
                console.log("after price: ");
                console.log(main.afterPrice);
                updateUserBalace(main);
            } 
        });

        // Update user balance amount
        function updateUserBalace(main) {
            var diffAmount = main.total - main.afterPrice;
            var Balance = mongoose.model('Balance');
            Balance.findOne(
                { userId: main.user._id },
                function (err, balance) {
                    if (!err) {
                        var newBalanceAmt = "";
                        if(balance){
                            newBalanceAmt = (Number(balance.balanceAmt) + diffAmount) + "";
                        } else {
                            newBalanceAmt = (0 + diffAmount) + "";
                        }
                        
                        Balance.findOneAndUpdate(
                            {userId: main.user._id},
                            {balanceAmt: newBalanceAmt},
                            function(err, balance){
                                if(!err){
                                    console.log("Update balance successfully!!!");
                                    createStatement(main,newBalanceAmt);
                                }
                            }
                        );
                    }
                }
            );
        }

        // Create statement
        function createStatement(main, balanceAmt){
            var createdDate = new Date();
			var year = "" + createdDate.getFullYear();
			var month = (createdDate.getMonth() + 1 >= 10) ? "" + (createdDate.getMonth()+ 1) : "0" + (createdDate.getMonth() + 1);
			var date = (createdDate.getDate() >= 10) ? "" + createdDate.getDate() : "0" + createdDate.getDate();
			var strDate = year + month + date;
            var data = {};
            data.user = main.user;
            data.owner = main.user;
            data.refNumber = main.barcode + '_5';
            data.name = main.barcode + ' ค่าส่วนต่างค่าส่งสินค้า';
            data.created = createdDate;
            data.sortDate = strDate;
            if (main.total > main.afterPrice) {
                data.amountIn = main.total - main.afterPrice;
            } else {
                data.amountOut = main.afterPrice - main.total;
            }
            data.balanceAmount = balanceAmt;
            var Statement = mongoose.model('Statement');
            var statement = new Statement(data);
            if(data.amountIn > 0 || data.amountOut > 0){
                statement.save(function (err) {
                    if (!err) {
                        console.log("Create statement successfully!!!")
                        updateDiffStatement(main);

                    } else {
                        console.log("Create statement error!!");
                        console.log(err);
                    }
                });
            } else {
                updateDiffStatement(main);
            }
        }

        // Update create difference amount statement
        function updateDiffStatement(argMain){
            Main.findOneAndUpdate(
                {barcode: argMain.barcode},
                {isCreateDiffStatment: true},
                function(err, main){
                    if(!err){
                        console.log("Update mains successfully!!!");
                    }
                }
            );
        }
}, false);

module.exports = task;
