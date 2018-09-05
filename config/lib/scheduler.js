'use strict';

var cron = require('node-cron'),
    mongoose = require('mongoose');


/**
 * 1. Retrieve เฉพาะข้อมูลที่
 *    1.1 ยอดก่อนส่ง และหลังส่งไม่ได้เท่ากัน 
 *    1.2 สถานะเป็น "นำจ่ายถึงผู้รับแล้ว" และ "นำจ่าย/ชำระเงินเรียบร้อย"
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
    Main.find({
        $expr: { $ne: ["$total", "$afterPrice"] },
        status: "ปณ.ต้นทางรับฝากแล้ว" ,
        isCreateDiffStatment: { $eq: false }
    })
        .sort('-created').populate('user').exec(function (err, mains) {
            if (!err) {
                for(var i=0; i<mains.length; i++){
                    updateUserBalace(mains, i);
                }
            }
        });

        // Update user balance amount
        function updateUserBalace(mains,i) {
            var diffAmount = mains[i].total - mains[i].afterPrice;
            var Balance = mongoose.model('Balance');
            Balance.findOne(
                { userId: mains[i].user._id },
                function (err, balance) {
                    if (!err) {
                        var newBalanceAmt = (Number(balance.balanceAmt) + diffAmount) + "";
                        Balance.findOneAndUpdate(
                            {userId: mains[i].user._id},
                            {balanceAmt: newBalanceAmt},
                            function(err, balance){
                                if(!err){
                                    console.log("Update balance successfully!!!");
                                    createStatement(mains, i, newBalanceAmt);
                                }
                            }
                        );
                    }
                }
            );
        }

        // Create statement
        function createStatement(mains, i, balanceAmt){
            var data = {};
            data.user = mains[i].user;
            data.owner = mains[i].user;
            data.refNumber = mains[i].barcode + '_5';
            data.name = 'ค่าส่วนต่างค่าส่งสินค้า';
            if (mains[i].total > mains[i].afterPrice) {
                data.mountIn = mains[i].total - mains[i].afterPrice;
            } else {
                data.amountOut = mains[i].afterPrice - mains[i].total;
            }
            data.balanceAmount = balanceAmt;
            var Statement = mongoose.model('Statement');
            var statement = new Statement(data);
            statement.save(function (err) {
                if (!err) {
                    console.log("Create statement successfully!!!")
                    updateDiffStatement(mains, i);

                }
            });
        }

        // Update create difference amount statement
        function updateDiffStatement(mains, i){
            Main.findOneAndUpdate(
                {barcode: mains[i].barcode},
                {isCreateDiffStatment: true},
                function(err, main){
                    if(!err){
                        console.log("Update mains successfully!!!")
                    }
                }
            );
        }
}, false);

module.exports = task;
