import React, { useState, useEffect } from 'react';
import { InputLabel, Select, FormControl, MenuItem } from '@mui/material';
import VibrationDataService from "../services/vibration.service.js";

const ClientsList = ({setValues, values, column}) => {
    const [clients, setClients] = useState([]);
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response =  await VibrationDataService.getactiveclients();
          const json = response.data;
          setClients(json);
        } catch (error) {
          console.error(error);
          return;
        }
      };
      fetchData();
    }, []);
    return (<FormControl fullWidth>
        <InputLabel id="allClients">{column.header}</InputLabel>
        <Select
          key={column.accessorKey} labelId="allClients" label={column.header} name={column.accessorKey}
          onChange={(e) =>
            {
              let selectedClient = clients.find((client) => client.id === e.target.value);

              if (setValues !== undefined) {
                setValues({ ...values, [e.target.name]: e.target.value, ['client.status']: selectedClient.status });
              }
            }}
        >
          {clients.map((client) => (
            <MenuItem key={client.id} value={client.id}>{client.name}</MenuItem>
          ))}
        </Select>
      </FormControl>);
  }

  export default ClientsList;