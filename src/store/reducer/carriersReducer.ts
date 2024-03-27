
import { createSlice } from '@reduxjs/toolkit';
import { fetchCarriersList } from '../actions/carriersActions';

export type CarrierType = {
    id: string;
    name: string;
    availability: boolean;
    onTimeDeliveryPercentage: number;
    rating: number;
    specialRequirements: string[];
}

export type CarrierFilter = {
    name: string | null;
    availability: boolean | null;
    onTimeDeliveryPercentage: number[];
    rating: number[];
    specialRequirements: string[]
};

export type CarrierState = {
    carriersList: {
        data: CarrierType[] | [];
        loading: boolean;
        error: string | null | undefined;
    };
    carrierFilter: CarrierFilter;
    carrier_cart: CarrierType[];
}

const initialState: CarrierState = {
    carriersList: {
        data: [],
        loading: false,
        error: null,
    },
    carrierFilter: {
        name: null,
        availability: null,
        onTimeDeliveryPercentage: [],
        rating: [],
        specialRequirements: []
    },
    carrier_cart: []
};

const carrierSlice = createSlice({
    name: 'carriers',
    initialState,
    reducers: {
        setCarrierFilter: (state, action) => {
            state.carrierFilter = action.payload;
        },
        clearCarrierCart: (state) => {
            state.carrier_cart = []
        },
        addToCarrierCart: (state, action) => {
            const newCarriers: CarrierType[] = action.payload
            const updatedCarrierCart = [...state.carrier_cart];
            newCarriers.forEach(newCarrier => {
                if (!updatedCarrierCart.some(carrier => carrier.id === newCarrier.id)) {
                    updatedCarrierCart.push(newCarrier);
                }
            });
            state.carrier_cart = updatedCarrierCart
        },
        updateCarrierCart: (state, action) => {
            const carrierIds = action.payload
            state.carrier_cart = [...state.carrier_cart.filter((carrier) => !carrierIds.includes(carrier.id))]
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCarriersList.pending, (state) => {
                state.carriersList = {
                    ...state.carriersList,
                    loading: true,
                    error: null,
                }

            })
            .addCase(fetchCarriersList.fulfilled, (state, action) => {
                state.carriersList = {
                    data: action.payload,
                    loading: false,
                    error: null,
                }
            })
            .addCase(fetchCarriersList.rejected, (state, action) => {
                state.carriersList = {
                    data: [],
                    loading: false,
                    error: action.error.message,
                }
            });
    },
});

export const { setCarrierFilter, addToCarrierCart, updateCarrierCart, clearCarrierCart } = carrierSlice.actions;
export default carrierSlice.reducer;
