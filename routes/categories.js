import express from 'express';
import {
    addCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} from '../controllers/categoryController.js';
import authenticateToken from '../middleware/authMiddleware.js';
const router = express.Router();

router.use(authenticateToken);

router.post('/', addCategory); 
router.get('/', getAllCategories); 
router.get('/:id', getCategoryById); 
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory); 

export const  categoryRouter=router;
