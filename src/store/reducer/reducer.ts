import { combineReducers } from '@reduxjs/toolkit';
import carriersReducer from './carriersReducer';
import bookingReducer from './bookingReducer';
import userReducer from './userReducer';



const rootReducer = combineReducers({
    user: userReducer,
    carriers: carriersReducer,
    booking: bookingReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
