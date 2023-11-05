// YourComponent.js
import React, { useState } from 'react';
import {
  DataGrid,
} from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';


const sampleData = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
  // Add more data here...
];

export default function YourComponent() {
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(sampleData);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();

    // Filter data based on the search query
    const filtered = sampleData.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query)
    );

    setSearchText(query);
    setFilteredData(filtered);
  };


  

  return (
    <div>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        onChange={handleSearch}
      />
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={filteredData}
          columns={[
            { field: 'id', headerName: 'ID', width: 70 },
            { field: 'name', headerName: 'Name', flex: 1 },
            { field: 'email', headerName: 'Email', flex: 1 },
          ]}
          
        />
      </div>
    </div>
  );
}


