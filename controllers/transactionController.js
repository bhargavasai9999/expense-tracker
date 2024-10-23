import Transaction from '../models/Transaction.js';
import Category from '../models/Category.js';
import mongoose from 'mongoose';

export const addTransaction = async (req, res) => {
    const { type, categoryName, amount, date, description } = req.body;

    if (!type || !categoryName || !amount || !date) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        let categoryId;

        const validCategory = await Category.findOne({ name: categoryName, user: req.user.id });

        if (validCategory) {
            categoryId = validCategory._id;
        } else {
            const newCategory = new Category({
                name: categoryName,
                type: type, 
                user: req.user.id
            });
            const savedCategory = await newCategory.save();
            categoryId = savedCategory._id; 
        }

        const transaction = new Transaction({
            type,
            category: categoryId,
            amount,
            date,
            description,
            user: req.user.id
        });
        await transaction.save();

        const populatedTransaction = await Transaction.findById(transaction._id).populate('category', 'name type');
        console.log(populatedTransaction)
        const response = {
            _id: populatedTransaction._id,
            type: populatedTransaction.type,
            category: {
                id: populatedTransaction.category._id,
                name: populatedTransaction.category.name,
                type: populatedTransaction.category.type
            },
            amount: populatedTransaction.amount,
            date: populatedTransaction.date,
            description: populatedTransaction.description,
            user: populatedTransaction.user,
            createdAt: populatedTransaction.createdAt,
            updatedAt: populatedTransaction.updatedAt,
            __v: populatedTransaction.__v
        };
        return res.status(201).json({
            message: "Transaction added successfully",
            data: response
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create transaction' });
    }
};

export const getAllTransactions = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const transactions = await Transaction.find({ user: req.user.id })
            .limit(parseInt(limit))
            .skip((page - 1) * limit)
            .populate('category', 'name type'); 
       

        return res.status(200).json(transactions);
    } catch (error) {
        return res.status(500).json({ error: `Failed to retrieve transactions: ${error}` });
    }
};

export const getTransactionById = async (req, res) => {
        try {
            const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user.id })
                .populate('category', 'name type')
    
            if (!transaction) {
                return res.status(404).json({ error: 'Transaction not found' });
            }
    
    
            return res.status(200).json(transaction);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to retrieve transaction' });
        }
    };
    
export const updateTransaction = async (req, res) => {
    const { type, categoryName, amount, date, description } = req.body;

    try {
        let categoryId;

        if (!categoryName) {
            const validCategory = await Category.findOne({ name: categoryName, user: req.user.id });

            if (validCategory) {
                categoryId = validCategory._id; 
            } else {
                const newCategory = new Category({
                    name: categoryName,
                    type: type, 
                    user: req.user.id
                });
                const savedCategory = await newCategory.save();
                categoryId = savedCategory._id; 
            }
        }

        const transaction = await Transaction.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            {
                type,
                category: categoryId || undefined, 
                amount,
                date,
                description
            },
            { new: true }
        ).populate('category', 'name type');

        if (!transaction) return res.status(404).json({ error: 'Transaction not found' });


        return res.status(200).json({
            message: "Transaction updated successfully",
            data: transaction
        });
    } catch (error) {
        console.error('Error updating transaction:', error);
        return res.status(500).json({ error: 'Failed to update transaction' });
    }
};

export const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
        return res.status(200).json({ message: 'Transaction deleted' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete transaction' });
    }
};

export const getSummary = async (req, res) => {
    const { startDate, endDate } = req.query;
    const userId = new mongoose.Types.ObjectId(req.user.id);

    try {
        const income = await Transaction.aggregate([
            { 
                $match: { 
                    user: userId, 
                    type: "income", 
                    date: { 
                        $gte: new Date(startDate || '2024-01-01'), 
                        $lte: new Date(endDate || '2025-12-31') 
                    } 
                } 
            },
            { 
                $group: { 
                    _id: null, 
                    total: { $sum: '$amount' } 
                } 
            }
        ]);

        const expenses = await Transaction.aggregate([
            { 
                $match: { 
                    user: userId, 
                    type: 'expense', 
                    date: { 
                        $gte: new Date(startDate || '2024-01-01'), 
                        $lte: new Date(endDate || '2025-12-31') 
                    } 
                } 
            },
            { 
                $group: { 
                    _id: null, 
                    total: { $sum: '$amount' } 
                } 
            }
        ]);

        return res.status(200).json({
            totalIncome: income[0]?.total || 0,
            totalExpenses: expenses[0]?.total || 0,
            balance: (income[0]?.total || 0) - (expenses[0]?.total || 0)
        });
    } catch (error) {
        console.error('Error retrieving summary:', error);
        return res.status(500).json({ error: 'Failed to retrieve summary' });
    }
};
