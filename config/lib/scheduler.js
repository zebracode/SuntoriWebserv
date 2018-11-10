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
    Main.find({
        barcode:{$ne:""},
        afterPrice: { $ne: 0 },
        status: {$ne: "ยังไม่ได้ชำระเงิน"},
        isCreateDiffStatment: { $eq: false }
    })
        .sort('-created').populate('user').exec(function (err, mains) {
            if (!err) {
                for(var i=0; i<mains.length; i++){
                    if(mains[i].total === mains[i].afterPrice || mains[i].afterPrice === 0){
                        console.log("Continue...");
                        continue;
                    }
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
                        var newBalanceAmt = "";
                        if(balance){
                            newBalanceAmt = (Number(balance.balanceAmt) + diffAmount) + "";
                        } else {
                            newBalanceAmt = (0 + diffAmount) + "";
                        }
                        
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
            var createdDate = new Date();
			var year = "" + createdDate.getFullYear();
			var month = (createdDate.getMonth() + 1 >= 10) ? "" + (createdDate.getMonth()+ 1) : "0" + (createdDate.getMonth() + 1);
			var date = (createdDate.getDate() >= 10) ? "" + createdDate.getDate() : "0" + createdDate.getDate();
			var strDate = year + month + date;
            var data = {};
            data.user = mains[i].user;
            data.owner = mains[i].user;
            data.refNumber = mains[i].barcode + '_5';
            data.name = mains[i].barcode + ' ค่าส่วนต่างค่าส่งสินค้า';
            data.created = createdDate;
            data.sortDate = strDate;
            if (mains[i].total > mains[i].afterPrice) {
                data.amountIn = mains[i].total - mains[i].afterPrice;
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

                } else {
                    console.log("Create statement error!!");
                    console.log(err);
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
                        console.log("main: ");
                        console.log(main);
                        console.log("Update mains successfully!!!");
                    }
                }
            );
        }
}, false);

module.exports = task;
