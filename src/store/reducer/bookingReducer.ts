
import { createSlice } from '@reduxjs/toolkit';
import { bookCarrierRequest, } from '../actions/bookingActions';
import { CarrierType } from './carriersReducer';
export type BookingState = {
    bookCarrier: {
        data: CarrierType[] | [];
        loading: boolean;
        error: string | null | undefined;
    };
    booking_history: {
        data: CarrierType[];
        loading: boolean;
        error: string | null | undefined;
    };
};

const initialState: BookingState = {
    bookCarrier: {
        data: [],
        loading: false,
        error: null,
    },
    booking_history: {
        data: [],
        loading: false,
        error: null,
    }
};

const bookCarrierSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        // add your reducers here
        addToBookingHistory: (state, action) => {
            state.booking_history = {
                ...state.booking_history,
                data: state.booking_history?.data?.length > 0 ? [...state.booking_history.data, ...action.payload] : [...action.payload],
                loading: false,
                error: null,
            };
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(bookCarrierRequest.pending, (state) => {
                state.bookCarrier = {
                    ...state.bookCarrier,
                    loading: true,
                    error: null,
                }

            })
            .addCase(bookCarrierRequest.fulfilled, (state) => {
                state.bookCarrier = {
                    ...state.bookCarrier,
                    loading: false,
                    error: null,
                }
            })
            .addCase(bookCarrierRequest.rejected, (state, action) => {
                state.bookCarrier = {
                    data: [],
                    loading: false,
                    error: action.error.message,
                }
            });
    },
});

export const { addToBookingHistory } = bookCarrierSlice.actions;

export default bookCarrierSlice.reducer;
