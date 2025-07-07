import React from 'react';
import { Link } from 'react-router-dom';

const ExpensesHome: React.FC = () => {
  return (
    <section className="expenses-home">
      <h2>📦 Expenses Dashboard</h2>

      <div className="expenses-actions">
        <Link to="/expenses/new" className="inventory-button">➕ Add New Expense</Link>
      </div>
    </section>
  );
};

export default ExpensesHome;