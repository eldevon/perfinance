import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiCreditCard, 
  FiPieChart, 
  FiBarChart2, 
  FiSettings,
  FiMenu,
  FiX 
} from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: '/', icon: <FiHome />, label: 'Dashboard' },
    { path: '/transactions', icon: <FiCreditCard />, label: 'Transactions' },
    { path: '/budget', icon: <FiPieChart />, label: 'Budget' },
    { path: '/reports', icon: <FiBarChart2 />, label: 'Reports' },
    { path: '/settings', icon: <FiSettings />, label: 'Settings' },
  ];

  return (
    <>
      <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FiX /> : <FiMenu />}
      </button>
      
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <nav className="sidebar-nav">
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => 
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <p>© 2024 Finance Tracker</p>
          <p className="version">v1.0.0</p>
        </div>
      </aside>
      
      {isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
};

export default Sidebar;
