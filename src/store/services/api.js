// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// import { backendBaseUrl } from '../../helper/utils'


// // Define a service using a base URL and expected endpoints
// export const dvxlockerAPI = createApi({
//     reducerPath: 'API_NAME',
//     baseQuery: fetchBaseQuery({
//          baseUrl: backendBaseUrl,
//         prepareHeaders: (headers, { getState }) => {
//             headers.set('Access-Control-Allow-Origin', '*')
//             return headers
//         } 
//     }),
//     endpoints: (builder) => ({
//         getLiquidityLockInfo: builder.query({
//             query: (name) => `getLiquidityLockInfo`,
//         }),
       
//         addLiquidityLockInfo: builder.mutation({
//             query: (liquidityLock)=> ({
//                 url: 'addProjectInfo',
//                 method: "POST",
//                 body: liquidityLock
//             })
//         }),
//     }),
// })

// // Export hooks for usage in functional components, which are
// // auto-generated based on the defined endpoints
// export const { useGetLiquidityLockInfoQuery, useAddLiquidityLockInfoMutation } = dvxlockerAPI

// // export const PriceAPI =  createApi({
// //     reducerPath: 'priceAPI',
// //     baseQuery: fetchBaseQuery({
// //          baseUrl: priceBaseUrl,
// //         prepareHeaders: (headers, { getState }) => {
// //             headers.set('Access-Control-Allow-Origin', '*')
// //             return headers
// //         } 
// //     }),
// //     endpoints: (builder) => ({
// //         tokens: builder.query({
// //             query: (address) => `tokens/${address}`,
// //         }),
// //     })
// // });

// // export const { useTokensQuery } = PriceAPI;
