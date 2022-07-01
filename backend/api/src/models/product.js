const mongoose = require('mongoose')
const ProductSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    produto: {
        type: String,
        require: [true,'Please enter an email address']
    },
    quantidade: {
        type: Number,
        require: [true,'Please enter a password']

    },
    validade: {
        type: Number,
        require: [true,'Please enter a creation_date']
    },
    categoria: {
        type: String,
        require: [true,'Please enter an category']
    },
    lista_compras: {
        type: Boolean,
    }
})



module.exports = mongoose.model('Product' , ProductSchema)