var express         = require('express');
const routes        = express.Router()
var userController  = require('./controller/user-controller');
var productController = require('./controller/product-controller')
var passport	    = require('passport');


routes.get('/', (req, res) => {
    return res.send('Hello, this is the API!');
});
 
routes.post('/register', userController.registerUser);
routes.post('/login', userController.loginUser);



routes.get('/user/products', passport.authenticate('jwt', { session: false }), productController.getProducts)
routes.post('/user/products/create',  passport.authenticate('jwt', { session: false }), productController.addProduct);
routes.put('/user/products/editQuantidade', passport.authenticate('jwt', { session: false }), productController.changeProductQuantity)
routes.post('/user/products/remove', passport.authenticate('jwt', { session: false }), productController.ProductDelete)
routes.post('/user/products/editlist', passport.authenticate('jwt', { session: false }), productController.ProductEditList)
routes.put('/user/products/edit', passport.authenticate('jwt', { session: false }), productController.changeProduct)



routes.get('/special', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.json({ msg: `Hey ${req.user.email}! I open at the close.` });
});

module.exports = routes;
