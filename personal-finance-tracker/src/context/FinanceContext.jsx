import React, { createContext, useState, useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';
import { 
  saveToLocalStorage, 
  loadFromLocalStorage 
} from '../utils/storage';
import { 
  calculateTotals, 
  calculateBudgetProgress,
  calculateGoalProgress,
  processRecurringTransactions 
} from '../utils/calculations';

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [recurringTransactions, setRecurringTransactions] = useState([]);
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

  // Load user-specific data
  useEffect(() => {
    if (!user) return;

    const userData = loadFromLocalStorage(`finance_${user.id}`) || {};
    
    setTransactions(userData.transactions || []);
    setBudgets(userData.budgets || []);
    setGoals(userData.goals || []);
    setRecurringTransactions(userData.recurringTransactions || []);
    setCategories(userData.categories || categories);
  }, [user]);

  // Save user-specific data
  useEffect(() => {
    if (!user) return;

    const userData = {
      transactions,
      budgets,
      goals,
      recurringTransactions,
      categories
    };
    
    saveToLocalStorage(`finance_${user.id}`, userData);
  }, [transactions, budgets, goals, recurringTransactions, categories, user]);

  // Process recurring transactions daily
  useEffect(() => {
    const processRecurring = () => {
      const newTransactions = processRecurringTransactions(recurringTransactions);
      if (newTransactions.length > 0) {
        setTransactions(prev => [...newTransactions, ...prev]);
      }
    };

    // Check on mount and then daily
    processRecurring();
    const interval = setInterval(processRecurring, 24 * 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [recurringTransactions]);

  // Transaction functions
  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: uuidv4(),
      date: new Date().toISOString(),
      userId: user?.id
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
      userId: user?.id
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

  // Goal functions
  const addGoal = (goal) => {
    const newGoal = {
      ...goal,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      currentAmount: 0,
      userId: user?.id
    };
    setGoals([...goals, newGoal]);
  };

  const updateGoal = (id, updatedGoal) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, ...updatedGoal } : goal
    ));
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const contributeToGoal = (id, amount) => {
    setGoals(goals.map(goal => {
      if (goal.id === id) {
        const newAmount = goal.currentAmount + amount;
        const isCompleted = newAmount >= goal.targetAmount;
        
        // Create transaction for contribution
        if (amount > 0) {
          addTransaction({
            description: `Contribution to ${goal.name}`,
            amount: amount,
            type: 'expense',
            category: 'Savings',
            date: new Date().toISOString()
          });
        }
        
        return {
          ...goal,
          currentAmount: newAmount,
          isCompleted,
          lastContribution: new Date().toISOString()
        };
      }
      return goal;
    }));
  };

  // Recurring transaction functions
  const addRecurringTransaction = (transaction) => {
    const newRecurring = {
      ...transaction,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      nextDate: calculateNextDate(transaction.frequency, new Date()),
      userId: user?.id
    };
    setRecurringTransactions([...recurringTransactions, newRecurring]);
  };

  const updateRecurringTransaction = (id, updatedTransaction) => {
    setRecurringTransactions(recurringTransactions.map(transaction => 
      transaction.id === id ? { ...transaction, ...updatedTransaction } : transaction
    ));
  };

  const deleteRecurringTransaction = (id) => {
    setRecurringTransactions(recurringTransactions.filter(transaction => transaction.id !== id));
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
  const goalsWithProgress = calculateGoalProgress(goals);
  
  // Recent transactions
  const recentTransactions = transactions.slice(0, 5);

  // Clear all data
  const clearAllData = () => {
    setTransactions([]);
    setBudgets([]);
    setGoals([]);
    setRecurringTransactions([]);
  };

  const value = {
    transactions,
    budgets: budgetsWithProgress,
    goals: goalsWithProgress,
    recurringTransactions,
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
    addGoal,
    updateGoal,
    deleteGoal,
    contributeToGoal,
    addRecurringTransaction,
    updateRecurringTransaction,
    deleteRecurringTransaction,
    addCategory,
    clearAllData,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

// Helper function for recurring transactions
const calculateNextDate = (frequency, currentDate) => {
  const date = new Date(currentDate);
  
  switch (frequency) {
    case 'daily':
      date.setDate(date.getDate() + 1);
      break;
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'biweekly':
      date.setDate(date.getDate() + 14);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1);
      break;
    default:
      date.setMonth(date.getMonth() + 1);
  }
  
  return date.toISOString();
};
