const express = require('express');
const {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty
} = require('../controllers/propertyController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../config/upload');

const router = express.Router();

router.get('/', getAllProperties);
router.get('/:id', getPropertyById);
router.post('/', authenticate, authorize('admin', 'agent'), upload.array('images', 10), createProperty);
router.put('/:id', authenticate, authorize('admin', 'agent'), updateProperty);
router.delete('/:id', authenticate, authorize('admin', 'agent'), deleteProperty);

module.exports = router;
