# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

NEXT Steps:
src/
├── components/
│   ├── Auth/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── AuthGuard.jsx
│   ├── Layout/
│   │   ├── Header.jsx (updated)
│   │   ├── Sidebar.jsx (updated)
│   │   └── Footer.jsx
│   ├── Transactions/
│   │   ├── TransactionForm.jsx (updated)
│   │   ├── TransactionList.jsx
│   │   └── TransactionItem.jsx
│   ├── Budget/
│   │   ├── BudgetForm.jsx
│   │   └── BudgetCard.jsx
│   ├── Goals/
│   │   ├── GoalForm.jsx
│   │   ├── GoalCard.jsx
│   │   └── GoalProgress.jsx
│   ├── Recurring/
│   │   ├── RecurringForm.jsx
│   │   └── RecurringList.jsx
│   ├── Charts/
│   │   ├── ExpenseChart.jsx
│   │   └── IncomeChart.jsx
│   └── Common/
│       ├── Card.jsx
│       ├── Button.jsx
│       ├── Input.jsx
│       └── ThemeToggle.jsx
├── pages/
│   ├── Dashboard.jsx (updated)
│   ├── Transactions.jsx
│   ├── Budget.jsx
│   ├── Reports.jsx
│   ├── Settings.jsx
│   ├── Goals.jsx (new)
│   ├── Recurring.jsx (new)
│   ├── Login.jsx (new)
│   └── Register.jsx (new)
├── context/
│   ├── FinanceContext.jsx (updated)
│   ├── AuthContext.jsx (new)
│   └── ThemeContext.jsx (new)
├── utils/
│   ├── storage.js (updated)
│   ├── calculations.js (updated)
│   ├── formatters.js
│   └── auth.js (new)
└── styles/
    ├── global.css (updated)
    └── variables.css (updated)

Step 2: Install Additional Dependencies
bash
Copy
npm install bcryptjs jsonwebtoken react-toastify
Step 3: Create Authentication Context
3.1 src/context/AuthContext.jsx
jsx
Copy
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  saveToLocalStorage, 
  loadFromLocalStorage, 
  clearLocalStorage 
} from '../utils/storage';
import { hashPassword, verifyPassword, generateToken } from '../utils/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session
    const storedUser = loadFromLocalStorage('user');
    const token = loadFromLocalStorage('token');
    
    if (storedUser && token) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const register = async (userData) => {
    try {
      const users = loadFromLocalStorage('users') || [];
      
      // Check if user already exists
      const existingUser = users.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash password
      const hashedPassword = await hashPassword(userData.password);
      
      const newUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        theme: 'light'
      };

      // Save user
      users.push(newUser);
      saveToLocalStorage('users', users);

      // Auto login after registration
      const token = generateToken(newUser);
      saveToLocalStorage('token', token);
      saveToLocalStorage('user', newUser);
      setUser(newUser);

      toast.success('Registration successful!');
      navigate('/');
      
      return { success: true };
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      return { success: false, error: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      const users = loadFromLocalStorage('users') || [];
      const user = users.find(u => u.email === email);
      
      if (!user) {
        throw new Error('User not found');
      }

      const isValid = await verifyPassword(password, user.password);
      if (!isValid) {
        throw new Error('Invalid password');
      }

      const token = generateToken(user);
      saveToLocalStorage('token', token);
      saveToLocalStorage('user', user);
      setUser(user);

      toast.success('Login successful!');
      navigate('/');
      
      return { success: true };
    } catch (error) {
      toast.error(error.message || 'Login failed');
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    clearLocalStorage();
    setUser(null);
    toast.info('Logged out successfully');
    navigate('/login');
  };

  const updateProfile = (updates) => {
    try {
      const users = loadFromLocalStorage('users') || [];
      const updatedUsers = users.map(u => 
        u.id === user.id ? { ...u, ...updates } : u
      );
      
      const updatedUser = { ...user, ...updates };
      
      saveToLocalStorage('users', updatedUsers);
      saveToLocalStorage('user', updatedUser);
      setUser(updatedUser);

      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error) {
      toast.error('Failed to update profile');
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

Step 4: Create Theme Context
4.1 src/context/ThemeContext.jsx
jsx
Copy
import React, { createContext, useState, useContext, useEffect } from 'react';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/storage';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Load theme from localStorage or system preference
    const savedTheme = loadFromLocalStorage('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setTheme(savedTheme);
      setIsDarkMode(savedTheme === 'dark');
    } else if (systemPrefersDark) {
      setTheme('dark');
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    saveToLocalStorage('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setIsDarkMode(newTheme === 'dark');
  };

  const setLightTheme = () => {
    setTheme('light');
    setIsDarkMode(false);
  };

  const setDarkTheme = () => {
    setTheme('dark');
    setIsDarkMode(true);
  };

  const value = {
    theme,
    isDarkMode,
    toggleTheme,
    setLightTheme,
    setDarkTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

Step 5: Update Finance Context for New Features
5.1 src/context/FinanceContext.jsx (Updated)
jsx
Copy
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

Step 6: Create New Utility Functions
6.1 src/utils/auth.js
javascript
Copy
import bcrypt from 'bcryptjs';

// Mock JWT for local storage (in production, use real JWT)
export const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name
  };
  return btoa(JSON.stringify(payload)); // Simple base64 encoding for demo
};

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token));
  } catch (error) {
    return null;
  }
};

export const isTokenValid = (token) => {
  const decoded = decodeToken(token);
  if (!decoded) return false;
  
  // Check if token is expired (24 hours)
  const issuedAt = decoded.iat || 0;
  const now = Math.floor(Date.now() / 1000);
  return (now - issuedAt) < 24 * 60 * 60;
};
6.2 Update src/utils/calculations.js
javascript
Copy
import { format, subMonths, isSameDay, addDays } from 'date-fns';

export const calculateTotals = (transactions) => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  return {
    totalIncome: totalIncome.toFixed(2),
    totalExpenses: totalExpenses.toFixed(2),
    balance: balance.toFixed(2),
  };
};

export const calculateBudgetProgress = (budgets, transactions) => {
  const currentMonth = format(new Date(), 'yyyy-MM');
  
  return budgets.map(budget => {
    const monthTransactions = transactions.filter(t => {
      const transactionDate = format(new Date(t.date), 'yyyy-MM');
      return transactionDate === currentMonth && t.category === budget.category;
    });

    const spent = monthTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const progress = (spent / budget.amount) * 100;
    const remaining = budget.amount - spent;

    return {
      ...budget,
      spent: spent.toFixed(2),
      progress: Math.min(progress, 100).toFixed(2),
      remaining: remaining.toFixed(2),
      isOverBudget: spent > budget.amount,
    };
  });
};

export const calculateGoalProgress = (goals) => {
  return goals.map(goal => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    const remaining = goal.targetAmount - goal.currentAmount;
    const daysRemaining = goal.deadline 
      ? Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24))
      : null;

    return {
      ...goal,
      progress: Math.min(progress, 100).toFixed(2),
      remaining: remaining.toFixed(2),
      daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
      isCompleted: goal.currentAmount >= goal.targetAmount,
    };
  });
};

export const processRecurringTransactions = (recurringTransactions) => {
  const today = new Date();
  const newTransactions = [];

  recurringTransactions.forEach(transaction => {
    const nextDate = new Date(transaction.nextDate);
    
    if (isSameDay(today, nextDate) || today > nextDate) {
      // Create new transaction
      newTransactions.push({
        ...transaction,
        id: `recurring_${transaction.id}_${Date.now()}`,
        date: today.toISOString(),
        isRecurring: true,
        recurringId: transaction.id
      });

      // Update next date
      transaction.nextDate = calculateNextDate(transaction.frequency, today);
    }
  });

  return newTransactions;
};

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

export const getMonthlySummary = (transactions) => {
  const currentMonth = format(new Date(), 'yyyy-MM');
  const monthTransactions = transactions.filter(t => 
    format(new Date(t.date), 'yyyy-MM') === currentMonth
  );

  const incomeByCategory = {};
  const expenseByCategory = {};

  monthTransactions.forEach(t => {
    if (t.type === 'income') {
      incomeByCategory[t.category] = (incomeByCategory[t.category] || 0) + parseFloat(t.amount);
    } else {
      expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + parseFloat(t.amount);
    }
  });

  return { incomeByCategory, expenseByCategory };
};

Step 7: Create Auth Components
7.1 src/components/Auth/Login.jsx
jsx
Copy
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../Common/Input';
import Button from '../Common/Button';
import Card from '../Common/Card';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    const result = await login(formData.email, formData.password);
    setLoading(false);
    
    if (result.success) {
      navigate('/');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            error={errors.email}
            icon={<FiMail />}
            required
          />
          
          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            error={errors.password}
            icon={<FiLock />}
            required
          />
          
          <div className="auth-options">
            <label className="checkbox">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="forgot-password">
              Forgot password?
            </Link>
          </div>
          
          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            loading={loading}
            icon={<FiLogIn />}
          >
            Sign In
          </Button>
        </form>
        
        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Sign up
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
7.2 src/components/Auth/Register.jsx
jsx
Copy
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../Common/Input';
import Button from '../Common/Button';
import Card from '../Common/Card';
import { FiUser, FiMail, FiLock, FiUserPlus } from 'react-icons/fi';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    const result = await register(formData);
    setLoading(false);
    
    if (result.success) {
      navigate('/');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join our finance community</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Full Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            error={errors.name}
            icon={<FiUser />}
            required
          />
          
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            error={errors.email}
            icon={<FiMail />}
            required
          />
          
          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            error={errors.password}
            icon={<FiLock />}
            required
          />
          
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            error={errors.confirmPassword}
            icon={<FiLock />}
            required
          />
          
          <div className="terms-agreement">
            <label className="checkbox">
              <input type="checkbox" required />
              <span>
                I agree to the{' '}
                <Link to="/terms" className="terms-link">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="terms-link">
                  Privacy Policy
                </Link>
              </span>
            </label>
          </div>
          
          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            loading={loading}
            icon={<FiUserPlus />}
          >
            Create Account
          </Button>
        </form>
        
        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Register;
7.3 src/components/Auth/AuthGuard.jsx
jsx
Copy
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AuthGuard = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AuthGuard;
7.4 src/components/Auth/Auth.css
css
Copy
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.auth-card {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.auth-header {
  text-align: center;
  padding: 2rem 2rem 1rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
}

.auth-header h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;
  font-weight: 700;
}

.auth-header p {
  margin: 0;
  opacity: 0.9;
  font-size: 0.95rem;
}

.auth-form {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.auth-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: #6b7280;
}

.checkbox input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.forgot-password {
  color: #3b82f6;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
}

.forgot-password:hover {
  text-decoration: underline;
}

.terms-agreement {
  margin: 0.5rem 0;
}

.terms-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}

.terms-link:hover {
  text-decoration: underline;
}

.auth-footer {
  padding: 1.5rem 2rem;
  text-align: center;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.auth-footer p {
  margin: 0;
  color: #6b7280;
  font-size: 0.95rem;
}

.auth-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
}

.auth-link:hover {
  text-decoration: underline;
}

.loading-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f4f6;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: auth-spinner 0.8s linear infinite;
}

@keyframes auth-spinner {
  to {
    transform: rotate(360deg);
  }
}

/* Dark mode */
[data-theme="dark"] .auth-card {
  background: #1f2937;
  color: white;
}

[data-theme="dark"] .auth-footer {
  background: #374151;
  border-top-color: #4b5563;
}

[data-theme="dark"] .checkbox {
  color: #d1d5db;
}

[data-theme="dark"] .auth-footer p {
  color: #d1d5db;
}

@media (max-width: 480px) {
  .auth-container {
    padding: 1rem;
  }
  
  .auth-card {
    max-width: 100%;
  }
  
  .auth-header,
  .auth-form

  

