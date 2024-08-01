// Need to use the React-specific entry point to import createApi
import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from '../lib/axios'
import { logInRegisterInstance } from '../lib/axios/instances'
import { apiRoutes } from '../lib/apiRoute'
interface RegisterUserRes {
    statusCode: number;
    data: Data;
    message: string;
    success: boolean;
}

interface Data {
    id: number;
    name: string;
    email: string;
}
export const registerUser = createApi({
    reducerPath: 'registerUser',
    baseQuery: axiosBaseQuery(logInRegisterInstance),
    endpoints: (builder) => ({
        createUser: builder.mutation<RegisterUserRes, string>({
            query: (data) => ({
                url: apiRoutes.register,
                method: "post",
                data: data
            }),
        })
    }),
})

export const { useCreateUserMutation } = registerUser