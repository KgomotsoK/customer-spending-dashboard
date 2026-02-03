import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import {
  Car,
  Film,
  Heart,
  MoreHorizontal,
  ShoppingBag,
  ShoppingCart,
  Utensils,
  Zap
} from 'lucide-react';
import { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import '../../styles/main.css';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

ChartJS.register(ArcElement, Tooltip, Legend);

const iconMap = {
  'shopping-cart': ShoppingCart,
  'zap': Zap,
  'car': Car,
  'film': Film,
  'utensils': Utensils,
  'shopping-bag': ShoppingBag,
  'heart': Heart
};

const CategoryPieChart = ({ data, loading = false, currency = 'ZAR' }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAllCategories, setShowAllCategories] = useState(false);

  if (loading) {
    return (
      <div className="card chart-card">
        <div className="chart-card__header">
          <div className="skeleton skeleton--title" style={{ width: '192px' }} />
        </div>
        <div className="chart-card__content">
          <div className="category-chart">
            <div className="skeleton skeleton--chart" style={{ width: '256px', height: '256px' }} />
            <div className="category-chart__legend-skeleton">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="skeleton" style={{ height: '48px', width: '100%' }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const categories = data?.categories || [];
  const totalAmount = data?.totalAmount || 0;
  
  // Sort categories by amount (descending)
  const sortedCategories = [...categories].sort((a, b) => b.amount - a.amount);
  
  // Show only top 5 by default, or all if toggled
  const displayCategories = showAllCategories 
    ? sortedCategories 
    : sortedCategories.slice(0, 5);

  const chartData = {
    labels: displayCategories.map(cat => cat.name),
    datasets: [{
      data: displayCategories.map(cat => cat.amount),
      backgroundColor: displayCategories.map(cat => cat.color),
      borderColor: displayCategories.map(cat => cat.color),
      borderWidth: 0,
      hoverBorderWidth: 2,
      hoverBorderColor: '#fff',
      hoverOffset: 8
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        boxPadding: 4,
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const category = displayCategories[context.dataIndex];
            return ` ${formatCurrency(value)} (${category.percentage}%)`;
          },
          afterLabel: (context) => {
            const category = displayCategories[context.dataIndex];
            return `${category.transactionCount} transactions`;
          }
        }
      }
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(selectedCategory?.name === category.name ? null : category);
  };

  return (
    <div className="card chart-card">
      <div className="chart-card__header">
        <h3 className="chart-card__title">Spending by Category</h3>
        <div className="chart-card__header-actions">
          {categories.length > 5 && (
            <button
              className="button button--ghost button--sm"
              onClick={() => setShowAllCategories(!showAllCategories)}
            >
              {showAllCategories ? 'Show less' : `+${categories.length - 5} more`}
            </button>
          )}
        </div>
      </div>
      <div className="chart-card__content">
        <div className="category-chart">
          <div className="category-chart__donut-container">
            <div className="category-chart__donut">
              <Doughnut data={chartData} options={options} />
              <div className="category-chart__center">
                <p className="category-chart__center-label">Total</p>
                <p className="category-chart__center-value">
                  {formatCurrency(totalAmount)}
                </p>
              </div>
            </div>
            
            {/* Chart annotations */}
            {selectedCategory && (
              <div className="chart-annotation">
                <div 
                  className="chart-annotation__dot"
                  style={{ backgroundColor: selectedCategory.color }}
                />
                <div className="chart-annotation__content">
                  <div className="chart-annotation__title">{selectedCategory.name}</div>
                  <div className="chart-annotation__amount">{formatCurrency(selectedCategory.amount)}</div>
                  <div className="chart-annotation__percentage">{selectedCategory.percentage}% of total</div>
                </div>
              </div>
            )}
          </div>

          <div className="category-chart__legend">
            {displayCategories.map((cat, index) => {
              const IconComponent = iconMap[cat.icon] || ShoppingCart;
              const isSelected = selectedCategory?.name === cat.name;
              
              return (
                <div 
                  key={index} 
                  className={`category-chart__item ${isSelected ? 'category-chart__item--selected' : ''}`}
                  onClick={() => handleCategoryClick(cat)}
                  style={isSelected ? { 
                    borderColor: cat.color,
                    backgroundColor: `${cat.color}10`
                  } : {}}
                >
                  <div className="category-chart__item-info">
                    <div 
                      className="category-chart__item-icon"
                      style={{ backgroundColor: `${cat.color}15` }}
                    >
                      <IconComponent size={16} style={{ color: cat.color }} />
                    </div>
                    <div>
                      <p className="category-chart__item-name">{cat.name}</p>
                      <p className="category-chart__item-count">
                        {cat.transactionCount} {cat.transactionCount === 1 ? 'transaction' : 'transactions'}
                      </p>
                    </div>
                  </div>
                  <div className="category-chart__item-amount">
                    <p className="category-chart__item-value">
                      {formatCurrency(cat.amount)}
                    </p>
                    <div className="category-chart__item-percentage-container">
                      <div 
                        className="category-chart__item-percentage-bar"
                        style={{ 
                          width: `${cat.percentage}%`,
                          backgroundColor: cat.color
                        }}
                      />
                      <span className="category-chart__item-percentage">
                        {formatPercentage(cat.percentage, false)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Show remaining categories count */}
            {!showAllCategories && categories.length > 5 && (
              <div className="category-chart__remaining">
                <button
                  className="button button--ghost button--sm"
                  onClick={() => setShowAllCategories(true)}
                >
                  <MoreHorizontal size={14} />
                  <span>Show {categories.length - 5} more categories</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPieChart;