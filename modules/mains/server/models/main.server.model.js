'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Main Schema
 */
var MainSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
//  title: {
//    type: String,
//    default: '',
//    trim: true,
//    required: 'กรุณากรอก title'
//  },
//  content: {
//    type: String,
//    default: '',
//    trim: true,
//    required: 'กรุณากรอกเ Content'
//  },
  s_name: {
    type: String,
    default: '',
    trim: true,
    required: 'กรุณากรอกชื่อ ผู้ส่ง'
  },
  s_tel: {
    type: String,
    default: '',
    trim: true,
    required: 'กรุณากรอกเบอร์โทรศัพท์ ผู้ส่ง'
  },
  s_address: {
    type: String,
    default: '',
    trim: true,
    required: 'กรุณากรอดที่อยู่ ผู้ส่ง'
  },
  s_country: {
      type: String,
      default: '',
      trim: true,
      required: 'กรุณากรอกจังหมัด ผู้ส่ง'
    },
  s_postcode: {
      type: String,
      default: '',
      trim: true,
      required: 'กรุณากรอกรหัสไปรษณีย์ ผู้ส่ง'
    },
  s_idNumber: {
        type: String,
        default: '',
        trim: true,
        required: 'กรุณากรอกเลขบัตรปรชาชน ผู้ส่ง'
      },
  r_name: {
    type: String,
    default: '',
    trim: true,
    required: 'กรุณากรอกชื่อ ผู้รับ'
  },
  r_tel: {
    type: String,
    default: '',
    trim: true,
    required: 'กรุณากรอดเบอร์โทรศัพท์ ผู้รับ'
  },
  r_address: {
    type: String,
    default: '',
    trim: true,
    required: 'กรุณากรอกที่อยู่ ผู้รับ'
  },
  r_country: {
      type: String,
      default: '',
      trim: true,
      required: 'กรุณากรอกจังหวัด ผู้รับ'
    },
  r_postcode: {
      type: String,
      default: '',
      trim: true,
      required: 'กรุณากรอกรหัสไปรณณีย์ ผู้รับ'
    },
  order: {
        type: String,
        default: '',
        trim: true,
        required: 'กรุณากรอก Order No.'
    },
  invoice: {
        type: String,
        default: '',
        trim: true
    },
  price: {
        type: String,
        default: '',
        trim: true,
        required: 'กรุณากรอกราคาที่ต้องการเรียกเก็บ'
      },
  weight: {
        type: String,
        default: '',
        trim: true
      },
  detail: {
        type: String,
        default: '',
        trim: true,
        required: 'กรุณากรอกรายละเอียดสินค้า'
      },
  barcode: {
        type: String,
        default: '',
        trim: true
      },
  user: {
      type: Schema.ObjectId,
      ref: 'User'
    },
  status: {
      type: String,
      default: '',
      trim: true
    }
});

mongoose.model('Main', MainSchema);
