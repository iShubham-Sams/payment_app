import { configureStore } from '@reduxjs/toolkit'
import counterReducer from "./sliceState/counterSlice.js"
import { registerUser } from '../services/register.js'
import { logIn } from '../services/login.js'

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        [registerUser.reducerPath]: registerUser.reducer,
        [logIn.reducerPath]: logIn.reducer
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(registerUser.middleware, logIn.middleware)
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch