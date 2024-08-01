import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from '../lib/axios'
import { logInRegisterInstance } from '../lib/axios/instances'
import { apiRoutes } from '../lib/apiRoute'

export const logIn = createApi({
    reducerPath: 'logIn',
    baseQuery: axiosBaseQuery(logInRegisterInstance),
    endpoints: (builder) => ({
        logInUser: builder.mutation({
            query: (data) => ({
                url: apiRoutes.logIn,
                method: 'post',
                data,
            }),
        }),
    }),
})

export const { useLogInUserMutation } = logIn

