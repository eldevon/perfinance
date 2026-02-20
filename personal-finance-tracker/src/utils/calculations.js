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
