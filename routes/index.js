const express = require('express');
const router = express.Router();

// GET /
router.get('/', (req, res) => res.render('root/index', {
    title: 'Home',
}))

module.exports = router;