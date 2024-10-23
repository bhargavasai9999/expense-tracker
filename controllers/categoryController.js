import Category from '../models/Category.js';

// Add a new category
export const addCategory = async (req, res) => {
    const { name, type } = req.body;

    try {
        const newCategory = new Category({ name, type, user: req.user.id });
        await newCategory.save();
        return res.status(201).json({
            message: 'Category added successfully',
            category: {
                id: newCategory._id,
                name: newCategory.name,
                type: newCategory.type,
            },
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to add category' });
    }
};

// Get all categories for the authenticated user
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({ user: req.user.id });
        const formattedCategories = categories.map(cat => ({
            id: cat._id,
            name: cat.name,
            type: cat.type,
        }));
        return res.status(200).json(formattedCategories);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to retrieve categories' });
    }
};

// Get category by ID
export const getCategoryById = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findOne({ _id: id, user: req.user.id });
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        return res.status(200).json({
            id: category._id,
            name: category.name,
            type: category.type,
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to retrieve category' });
    }
};

// Update category
export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, type } = req.body;

    try {
        const category = await Category.findOneAndUpdate(
            { _id: id, user: req.user.id },
            { name, type },
            { new: true }
        );
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        return res.status(200).json({
            message: 'Category updated successfully',
            category: {
                id: category._id,
                name: category.name,
                type: category.type,
            },
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update category' });
    }
};

export const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findOneAndDelete({ _id: id, user: req.user.id });
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        return res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete category' });
    }
};
