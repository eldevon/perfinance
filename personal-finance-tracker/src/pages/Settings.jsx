import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import Card from '../components/Common/Card';
import Button from '../components/Common/Button';
import Input from '../components/Common/Input';
import { FiPlus, FiTrash2, FiSave } from 'react-icons/fi';
import './Settings.css';

const Settings = () => {
  const { categories, addCategory, clearAllData } = useFinance();
  const [newCategory, setNewCategory] = useState({ name: '', type: 'expense', color: '#FF6B6B' });
  const [currency, setCurrency] = useState('USD');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategory.name.trim()) {
      addCategory(newCategory);
      setNewCategory({ name: '', type: 'expense', color: '#FF6B6B' });
    }
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      clearAllData();
    }
  };

  const colorOptions = [
    '#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2',
    '#073B4C', '#7209B7', '#F72585', '#3A86FF', '#FB5607'
  ];

  return (
    <div className="settings-page">
      <div className="page-header">
        <h2>Settings</h2>
        <p>Customize your finance tracker</p>
      </div>
      
      <div className="settings-content">
        <div className="settings-section">
          <Card title="Categories">
            <div className="categories-list">
              {categories.map(category => (
                <div key={category.id} className="category-item">
                  <div className="category-info">
                    <span 
                      className="category-color" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="category-name">{category.name}</span>
                    <span className={`category-type ${category.type}`}>
                      {category.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <form onSubmit={handleAddCategory} className="add-category-form">
              <h4>Add New Category</h4>
              <div className="form-row">
                <Input
                  label="Category Name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="Enter category name"
                  required
                />
                
                <div className="input-group">
                  <label className="input-label">Type</label>
                  <select
                    value={newCategory.type}
                    onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value })}
                    className="input-field"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                
                <div className="input-group">
                  <label className="input-label">Color</label>
                  <div className="color-picker">
                    {colorOptions.map(color => (
                      <button
                        key={color}
                        type="button"
                        className={`color-option ${newCategory.color === color ? 'selected' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewCategory({ ...newCategory, color })}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <Button type="submit" icon={<FiPlus />}>
                Add Category
              </Button>
            </form>
          </Card>
        </div>
        
        <div className="settings-section">
          <Card title="Preferences">
            <div className="preferences-form">
              <div className="form-row">
                <div className="input-group">
                  <label className="input-label">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="input-field"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="JPY">JPY (¥)</option>
                  </select>
                </div>
                
                <div className="input-group">
                  <label className="input-label">Date Format</label>
                  <select
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                    className="input-field"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
              
              <Button icon={<FiSave />}>
                Save Preferences
              </Button>
            </div>
          </Card>
        </div>
        
        <div className="settings-section">
          <Card title="Data Management">
            <div className="data-management">
              <div className="data-info">
                <p>
                  All your data is stored locally in your browser's storage.
                  Clearing browser data will delete all your financial records.
                </p>
              </div>
              
              <div className="data-actions">
                <Button 
                  variant="danger" 
                  icon={<FiTrash2 />}
                  onClick={handleClearData}
                >
                  Clear All Data
                </Button>
                
                <Button variant="secondary">
                  Export Data
                </Button>
                
                <Button variant="secondary">
                  Import Data
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
