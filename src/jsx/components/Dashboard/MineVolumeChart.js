import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axiosInstance from '../../../services/AxiosInstance';
import { baseURL_ } from '../../../config';
import { toast } from 'react-toastify';

const MineVolumeChart = ({ country, height = 350 }) => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMineral, setSelectedMineral] = useState('');
  const [error, setError] = useState(null);
  const [access, setAccess] = useState(localStorage.getItem(`_dash`) || '3ts');
  
  // Define minerals based on access type
  const minerals = access === '3ts' 
    ? [
        { id: 'Cassiterite', label: 'Cassiterite', color: '#4dc9f6' },
        { id: 'Coltan', label: 'Coltan', color: '#f67019' },
      ]
    : [
        { id: 'Gold', label: 'Gold', color: '#acc236' },
        { id: 'Diamond', label: 'Diamond', color: '#537bc4' },
      ];

  // Set default selected mineral based on access type
  useEffect(() => {
    setAccess(localStorage.getItem(`_dash`) || '3ts');
    setSelectedMineral(access === '3ts' ? 'Cassiterite' : 'Gold');
  }, [access]);

  const fetchSalesData = async (mineral) => {
    setLoading(true);
    setError(null);
    let normalizedCountryq = country.trim();
            
    // Special handling for Rwanda
    if (normalizedCountryq.toLowerCase() === 'rwanda') {
        // Randomly choose one of the three formats
         normalizedCountryq ='.Rwanda';
        // normalizedCountry = formats[Math.floor(Math.random() * formats.length)];
    } else {
        // For other countries, remove leading/trailing dots and spaces
        normalizedCountryq = normalizedCountryq.replace(/^\.+|\.+$/g, '');
    }
    
    try {
      const response = await axiosInstance.get(`${baseURL_}report/sales/${mineral}`, {
        params: { country }
      });
      
      if (response.data && response.data.success && response.data.salereport) {
        // Sort by volume in descending order
        const sortedData = response.data.salereport
          .filter(item => item.supplier) // Remove items with empty supplier names
          .sort((a, b) => b.volume - a.volume)
          .slice(0, 5); // Take top 5 for better visualization in small space
        
        setSalesData(sortedData);
      } else {
       // setError('Invalid data format received from API');
        // toast.error('Failed to load mine volume data');
      }
    } catch (err) {
      //setError(err.message || 'Error fetching sales data');
      // toast.error('Failed to load mine volume data');
      console.error('Error fetching sales data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedMineral) {
      fetchSalesData(selectedMineral);
    }
  }, [selectedMineral, country]);

  const handleMineralChange = (mineral) => {
    setSelectedMineral(mineral);
  };

  const getMineralColor = (mineralId) => {
    const mineral = minerals.find(m => m.id === mineralId);
    return mineral ? mineral.color : '#000';
  };

  // Format large numbers with commas
  const formatNumber = (num) => {
    return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
  };

  // Custom tooltip to display more detailed information
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip" style={{ 
          backgroundColor: '#fff', 
          padding: '5px', 
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '11px'
        }}>
          <p className="supplier" style={{ margin: '0 0 2px 0' }}><strong>{data.supplier}</strong></p>
          <p className="volume" style={{ margin: '0 0 2px 0' }}>Volume: {formatNumber(data.volume)} kg</p>
          <p className="value" style={{ margin: '0' }}>Value: ${formatNumber(data.value)}</p>
        </div>
      );
    }
    return null;
  };

  // Calculate chart height based on container height
  const chartHeight = height - 70; // Subtract header height

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <div className="d-flex justify-content-between align-items-center py-2 px-3">
        <h4 className="mb-0" style={{ fontSize: '16px' }}>Supplier Delivery Performance</h4>
        <div className="d-flex mineral-filters">
          {minerals.map(mineral => (
            <button
              key={mineral.id}
              onClick={() => handleMineralChange(mineral.id)}
              className={`btn ${selectedMineral === mineral.id ? 'btn-primary' : 'btn-outline-primary'} btn-sm mx-1 py-0`}
              style={{ 
                backgroundColor: selectedMineral === mineral.id ? mineral.color : 'transparent',
                borderColor: mineral.color,
                color: selectedMineral === mineral.id ? '#fff' : mineral.color,
                fontSize: '10px',
                padding: '2px 5px'
              }}
            >
              {mineral.label}
            </button>
          ))}
        </div>
      </div>
      <div className="px-2" style={{ height: `calc(100% - 50px)` }}>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
            <div className="spinner-border spinner-border-sm text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger p-1" style={{ fontSize: '11px' }}>{error}</div>
        ) : salesData.length === 0 ? (
          <div className="alert alert-info p-1" style={{ fontSize: '11px' }}>No data available </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={salesData}
              margin={{ top: 5, right: 10, left: 40, bottom: 40 }} 
              barSize={30}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="supplier" 
                angle={-25} 
                textAnchor="end"
                height={50}
                interval={0}
                tick={{ fontSize: 10 }}
              />
              <YAxis 
                tick={{ fontSize: 10 }}
                tickFormatter={value => formatNumber(value)}
                width={50}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="volume" 
                name={`${selectedMineral} Volume`} 
                fill={getMineralColor(selectedMineral)} 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default MineVolumeChart;