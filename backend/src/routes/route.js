const router = require('express').Router();
const { auth } = require('../middlewares/authMiddleware');
const { allow } = require('../middlewares/roleMiddleware');

const authC = require('../controllers/authController');
const userC = require('../controllers/userController');
const productC = require('../controllers/productController');
const supplierC = require('../controllers/supplierController');
const poC = require('../controllers/purchaseOrderController');
const dashC = require('../controllers/dashboardController');

const { validateLogin, validateUser, validateProduct, validateSupplier,
    validatePurchaseOrder, validateUpdateStatus } = require('../middlewares/validation');

router.post('/auth/login', validateLogin, authC.login);
router.post('/auth/refreshToken', authC.refreshToken);

router.use(auth);

router.post('/createUser', validateUser, allow('OWNER'), userC.createUser);
router.get('/userList', allow('OWNER', 'MANAGER'), userC.userList);
router.delete('/deleteUser/:id', allow('OWNER'), userC.deleteUser);

router.post('/addProducts', validateProduct, allow('OWNER', 'MANAGER'), productC.addProducts);
router.get('/productList', productC.productList);
router.delete('/deleteProduct/:id', allow('OWNER'), productC.deleteProduct);

router.post('/addSupplier', validateSupplier, allow('OWNER', 'MANAGER'), supplierC.addSuppliers);
router.get('/supplierList', supplierC.supplierList);
router.delete('/deleteSupplier/:id', allow('OWNER'), supplierC.deleteSupplier);

router.post('/addPurchaseOrder', validatePurchaseOrder, allow('OWNER', 'MANAGER'), poC.addPurchaseOrder);
router.get('/purchaseOrderList', allow('OWNER', 'MANAGER'), poC.PurchaseOrderList);
router.put('/updateStatus/:id', validateUpdateStatus, allow('OWNER', 'MANAGER'), poC.updateStatus);
router.put('/receivePurchaseOrder/:id', allow('OWNER', 'MANAGER'), poC.PurchaseOrderReceive);


router.get('/stockMovements', poC.getStockMovements);

router.get('/dashboardCounts', dashC.dashboardCounts);
router.get('/orderStatusStats', dashC.orderStatusStats);
router.get('/topSuppliers', dashC.topSuppliers);
router.get('/lowStockList', dashC.lowStockList);

router.post('/auth/logout', authC.logout);


module.exports = router;
