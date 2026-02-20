import { format, startOfMonth, endOfMonth } from 'date-fns';

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
