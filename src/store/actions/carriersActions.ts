import { createAsyncThunk } from '@reduxjs/toolkit';
import { carriersListApiEndPoint } from '../../services/api';
import { CarrierType } from '../reducer/carriersReducer';


export const fetchCarriersList = createAsyncThunk<CarrierType[], void>(
    'carriers/fetchCarriers',
    async () => {
        try {
            const response = await fetch(carriersListApiEndPoint);
            const carriersData = await response.json()
            return carriersData.carriers;
        } catch (error) {
            throw new Error('Error fetching user data');
        }
    }
);
