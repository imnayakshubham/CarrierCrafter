
import { createAsyncThunk } from '@reduxjs/toolkit';
import { clearCarrierCart } from '../reducer/carriersReducer';

const fakeAPICall = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ data: "Fake API response data" });
        }, 2000);
    });
};

const makeFakeAPICall = async () => {
    try {
        const response = await fakeAPICall();
        return response

    } catch (error) {
        console.error("Fake API call failed:", error);
    }
};


export const bookCarrierRequest = createAsyncThunk(
    'booking/bookCarrierRequest', async (_, { dispatch }) => {
        try {
            const response = await makeFakeAPICall()
            if (response) {
                dispatch(clearCarrierCart())
            }
        } catch (error) {
            throw new Error('Error fetching user data');
        }
    }
);
