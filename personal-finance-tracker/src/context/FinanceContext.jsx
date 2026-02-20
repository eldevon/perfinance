import React, { createContext, useState, useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  saveToLocalStorage, 
  loadFromLocalStorage, 
  clearLocalStorage 
} from '../utils/storage';
import { calculateTotals, calculateBudgetProgress } from '../utils/calculations';

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([
    { id: 1, name: 'Food & Dining', type: 'expense', color: '#FF6B6B' },
    { id: 2, name: 'Transportation', type: 'expense', color: '#4ECDC4' },
    { id: 3, name: 'Shopping', type: 'expense', color: '#FFD166' },
    { id: 4, name: 'Entertainment', type: 'expense', color: '#06D6A0' },
    { id: 5, name: 'Bills & Utilities', type: 'expense', color: '#118AB2' },
    { id: 6, name: 'Healthcare', type: 'expense', color: '#073B4C' },
    { id: 7, name: 'Salary', type: 'income', color: '#7209B7' },
    { id: 8, name: 'Freelance', type: 'income', color: '#F72585' },
    { id: 9, name: 'Investment', type: 'income', color: '#3A86FF' },
  ]);

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedTransactions = loadFromLocalStorage('transactions') || [];
    const savedBudgets = loadFromLocalStorage('budgets') || [];
    const savedCategories = loadFromLocalStorage('categories') || categories;
    
    setTransactions(savedTransactions);
    setBudgets(savedBudgets);
    setCategories(savedCategories);
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    saveToLocalStorage('transactions', transactions);
  }, [transactions]);

  useEffect(() => {
    saveToLocalStorage('budgets', budgets);
  }, [budgets]);

  useEffect(() => {
    saveToLocalStorage('categories', categories);
  }, [categories]);

  // Transaction functions
  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: uuidv4(),
      date: new Date().toISOString(),
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
  };

  const updateTransaction = (id, updatedTransaction) => {
    setTransactions(transactions.map(transaction => 
      transaction.id === id ? { ...transaction, ...updatedTransaction } : transaction
    ));
  };

  // Budget functions
  const addBudget = (budget) => {
    const newBudget = {
      ...budget,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      spent: 0,
    };
    setBudgets([...budgets, newBudget]);
  };

  const updateBudget = (id, updatedBudget) => {
    setBudgets(budgets.map(budget => 
      budget.id === id ? { ...budget, ...updatedBudget } : budget
    ));
  };

  const deleteBudget = (id) => {
    setBudgets(budgets.filter(budget => budget.id !== id));
  };

  // Category functions
  const addCategory = (category) => {
    const newCategory = {
      ...category,
      id: uuidv4(),
    };
    setCategories([...categories, newCategory]);
  };

  // Calculations
  const { totalIncome, totalExpenses, balance } = calculateTotals(transactions);
  const budgetsWithProgress = calculateBudgetProgress(budgets, transactions);

  // Recent transactions
  const recentTransactions = transactions.slice(0, 5);

  // Clear all data
  const clearAllData = () => {
    setTransactions([]);
    setBudgets([]);
    clearLocalStorage();
  };

  const value = {
    transactions,
    budgets: budgetsWithProgress,
    categories,
    totalIncome,
    totalExpenses,
    balance,
    recentTransactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    addBudget,
    updateBudget,
    deleteBudget,
    addCategory,
    clearAllData,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};
