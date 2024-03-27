
import { createSlice } from '@reduxjs/toolkit';
import { fetchUserData } from '../actions/userActions';
import { appRootKey } from '../../constants';


export type UserData = {
    user_name: string | null;
    user_email: string | null;
    user_image: string | null;
    id: string | null;
};

type UserState = {
    data: UserData | null;
    loading: boolean;
    error: string | null | undefined;
};

export type UserInfoStateType = {
    userInfo: UserState;
};

const initialState: UserInfoStateType = {
    userInfo: {
        data: null,
        loading: false,
        error: null,
    }
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
            state.userInfo = {
                data: null,
                loading: false,
                error: null,
            }
            localStorage.removeItem(`persist:${appRootKey}`);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserData.pending, (state) => {
                state.userInfo = {
                    ...state.userInfo,
                    loading: true,
                    error: null,
                }

            })
            .addCase(fetchUserData.fulfilled, (state, action) => {
                const userData = action.payload;

                state.userInfo = {
                    data: userData ?? null,
                    loading: false,
                    error: null,
                }
            })
            .addCase(fetchUserData.rejected, (state, action) => {
                state.userInfo = {
                    data: null,
                    loading: false,
                    error: action.error.message,
                }
            });
    },
});

export const { logout } = userSlice.actions;
const userReducer = userSlice.reducer;
export default userReducer;

