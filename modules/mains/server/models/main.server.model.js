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
//    required: 'กรุณากรอก Content'
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
    required: 'กรุณากรอกที่อยู่ ผู้ส่ง'
  },
  s_ampher: {
        type: String,
        default: '',
        trim: true,
        required: 'กรุณากรอกจังหวัด ผู้ส่ง'
      },
  s_country: {
      type: String,
      default: '',
      trim: true,
      required: 'กรุณากรอกจังหวัด ผู้ส่ง'
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
        required: 'กรุณากรอกเลขบัตรประชาชน ผู้ส่ง'
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
    required: 'กรุณากรอกเบอร์โทรศัพท์ ผู้รับ'
  },
  r_email: {
      type: String,
      default: '',
      trim: true
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
  r_ampher: {
    type: String,
    default: '',
    trim: true,
    required: 'กรุณากรอกข้อมูลอำเภอ'
  },
  r_comment: {
      type: String,
      default: '',
      trim: true
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
        trim: true,
        required: true,
        unique: true
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
        trim: true,
        required: 'กรุณากรอกน้ำหนัก'
      },
  detail: {
        type: String,
        default: '',
        trim: true,
        required: 'กรุณากรอกข้อมูลให้ครบถ้วน'
      },
  barcode: {
        type: String,
        default: '',
        trim: true
      },
  total: {
        type: String,
        default: '',
        trim: true
      },
  selectedOption: {
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
    },
  tpWeight: {
    type: String,
    default: '',
    trim: true
  },
  rcpDocNo: {
    type: String,
    default: '',
    trim: true
  },
  afterPrice: String
});

mongoose.model('Main', MainSchema);
