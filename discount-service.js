const express = require('express');
const router = express.Router();
test_discountCodes = [
    {code: 'DISCOUNT10', discount: 10, type: 'percentage', active: true},
    {code: 'DISCOUNT20', discount: 20, type: 'fixed', active: true},
]

const ADMIN_PASSWORD = 'admin123';

router.post('/apply', (req, res) => {
    const {code, cartTotal} = req.body;
    const discountCode = test_discountCodes.find(dc => dc.code === code && dc.active);
    if (!discountCode) {
        return res.status(400).json({error: 'Invalid or inactive discount code'});
    }
    let newTotal;
    if (discountCode.type === 'percentage') {
        newTotal = cartTotal - (cartTotal * (discountCode.discount / 100));
    } else {
        newTotal = cartTotal - discountCode.discount;
    }
    return res.json({
        originalTotal: cartTotal,
        discount: discountCode.discount,
        discountType: discountCode.type,
        total: newTotal
    });
});

router.post('/admin/create', (req, res) => {
    const {code, discount, type, password} = req.body;
    if (password !== ADMIN_PASSWORD) {
        return res.status(403).json({error: 'Unauthorized'});
    }
    discountCodes.push({code, discount, type, active: true});
    return res.json({message: 'Discount code created successfully'});
});

router.get('/admin/list', (req, res) => {
    return res.json(discountCodes);
});

router.delete('/admin/delete', (req, res) => {
    const {code, password} = req.body;
    if (password !== ADMIN_PASSWORD) {
        return res.status(403).json({error: 'Unauthorized'});
    }
    discountCodes = discountCodes.filter(dc => dc.code !== code);
    return res.json({message: 'Discount code deleted successfully'});
});

module.exports = router;