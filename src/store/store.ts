import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './reducer/reducer';
import { appRootKey } from '../constants';

const persistConfig = {
    key: appRootKey,
    storage,
    whilelist: ['user', "carriers", "booking"]
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(
        {
            serializableCheck: false,
        }
    ),
});

export type AppDispatch = typeof store.dispatch

export const persistor = persistStore(store);
