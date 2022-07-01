const mongoose = require("mongoose");
const ProductBarcodeSchema = new mongoose.Schema({
  produto: {
    type: String
  },
  serialNumber: {
    type: Number
  }
})
module.exports = mongoose.model('Product' , ProductBarcodeSchema)
