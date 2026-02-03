// src/components/charts/TrendChart.jsx
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from 'chart.js';
import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import '../../styles/main.css';
import { formatCurrency, formatDate, parseMonth } from '../../utils/formatters';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const TrendChart = ({ data, loading = false }) => {
  const [chartType, setChartType] = React.useState('line');

  if (loading) {
    return (
      <div className="card chart-card">
        <div className="chart-card__header">
          <div className="skeleton skeleton--title" style={{ width: '192px' }} />
          <div className="skeleton" style={{ width: '128px', height: '36px', borderRadius: 'var(--radius-lg)' }} />
        </div>
        <div className="chart-card__content">
          <div className="skeleton" style={{ height: '288px', width: '100%' }} />
        </div>
      </div>
    );
  }

  const trends = data?.trends || [];
  const labels = trends.map(t => formatDate(parseMonth(t.month), 'monthOnly'));
  
  const lineChartData = {
    labels,
    datasets: [
      {
        label: 'Total Spent',
        data: trends.map(t => t.totalSpent),
        borderColor: '#2F70EF',
        backgroundColor: 'rgba(47, 112, 239, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#2F70EF',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const barChartData = {
    labels,
    datasets: [
      {
        label: 'Total Spent',
        data: trends.map(t => t.totalSpent),
        backgroundColor: '#2F70EF',
        borderRadius: 6,
        barThickness: 24
      },
      {
        label: 'Transactions',
        data: trends.map(t => t.transactionCount * 100),
        backgroundColor: '#4ECDC4',
        borderRadius: 6,
        barThickness: 24
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index'
    },
    plugins: {
      legend: {
        display: chartType === 'bar',
        position: 'top',
        align: 'end',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 8,
          padding: 16,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: '#1E293B',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        boxPadding: 4,
        callbacks: {
          title: (items) => {
            const index = items[0].dataIndex;
            return formatDate(parseMonth(trends[index].month), 'month');
          },
          label: (context) => {
            if (context.dataset.label === 'Transactions') {
              return ` ${trends[context.dataIndex].transactionCount} transactions`;
            }
            return ` ${formatCurrency(context.raw)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#64748B',
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: '#E2E8F0',
          drawBorder: false
        },
        ticks: {
          color: '#64748B',
          font: {
            size: 11
          },
          callback: (value) => formatCurrency(value, false)
        }
      }
    }
  };

  return (
    <div className="card chart-card">
      <div className="chart-card__header">
        <h3 className="chart-card__title">Monthly Spending Trends</h3>
        <div className="tabs">
          <button 
            className={`tabs__trigger ${chartType === 'line' ? 'tabs__trigger--active' : ''}`}
            onClick={() => setChartType('line')}
          >
            Line
          </button>
          <button 
            className={`tabs__trigger ${chartType === 'bar' ? 'tabs__trigger--active' : ''}`}
            onClick={() => setChartType('bar')}
          >
            Bar
          </button>
        </div>
      </div>
      <div className="chart-card__content">
        <div className="chart-container">
          {chartType === 'line' ? (
            <Line data={lineChartData} options={options} />
          ) : (
            <Bar data={barChartData} options={options} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TrendChart;
