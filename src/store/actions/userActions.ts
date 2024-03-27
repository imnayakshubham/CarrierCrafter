import { createAsyncThunk } from '@reduxjs/toolkit';
import { UserData } from '../reducer/userReducer';

export const fetchUserData = createAsyncThunk(
    'user/fetchUserData',
    async () => {
        try {
            const users = await fetch("https://randomuser.me/api/");
            const data = await users.json();
            if (data.results.length > 0) {
                const userInfo = {
                    user_name: data.results[0].name.first,
                    user_email: data.results[0].email,
                    user_image: data.results[0].picture.large,
                    id: data.results[0].login.uuid
                }
                return userInfo as UserData;
            }
        } catch (error) {
            throw new Error('Error fetching user data');
        }
    }
);
