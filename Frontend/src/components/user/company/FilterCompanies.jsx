import React, { useState, useEffect } from 'react';
import { Checkbox, Button } from 'antd';
import axios from 'axios';

const FilterCompanies = ({ onFilterChange }) => {
  const [showAll, setShowAll] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get('https://provinces.open-api.vn/api/p/');
        setProvinces(response.data);
      } catch (error) {
        console.error('Lỗi khi tải danh sách tỉnh thành:', error);
      }
    };
    fetchProvinces();
  }, []);

  const displayedLocations = showAll ? provinces : provinces.slice(0, 5);

  const handleLocationChange = (locationCode, checked) => {
    const locationCodeString = String(locationCode);
    
    const newSelectedLocations = checked 
      ? [...selectedLocations, locationCodeString]
      : selectedLocations.filter(code => code !== locationCodeString);
    
    setSelectedLocations(newSelectedLocations);
    onFilterChange(newSelectedLocations);
  };

  return (
    <div className="filter-sidebar p-3">
      <h5 className="text-start">Nơi làm việc</h5>
      <ul className="list-unstyled">
        {displayedLocations.map((province) => (
          <li key={province.code} className="mb-2">
            <div className="form-check d-flex align-items-center">
              <Checkbox 
                id={`location-${province.code}`}
                className="me-2"
                checked={selectedLocations.includes(String(province.code))}
                onChange={(e) => handleLocationChange(province.code, e.target.checked)}
              />
              <label
                className="form-check-label"
                htmlFor={`location-${province.code}`}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  const isCurrentlySelected = selectedLocations.includes(String(province.code));
                  handleLocationChange(province.code, !isCurrentlySelected);
                }}
              >
                {province.name}
              </label>
            </div>
          </li>
        ))}
        <li className="mt-2">
          <Button 
            onClick={() => setShowAll(!showAll)} 
            type="link" 
            className="p-0" 
            style={{ textDecoration: 'none', color: 'rgb(204, 10, 157)'}}
          >
            {showAll ? "Thu gọn" : "Tất cả"}
          </Button>
        </li>
      </ul>
    </div>
  );
};

export default FilterCompanies;
