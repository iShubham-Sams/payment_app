import { configureStore } from '@reduxjs/toolkit'
import counterReducer from "./sliceState/counterSlice.js"
import { registerUser } from '../services/register.js'

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        [registerUser.reducerPath]: registerUser.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(registerUser.middleware)
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch