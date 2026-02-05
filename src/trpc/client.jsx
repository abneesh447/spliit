'use client'; // <-- to make sure we can mount the Provider from a server component
import { Prisma } from '@/generated/prisma/browser';
import { QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { useState } from 'react';
import superjson from 'superjson';
import { makeQueryClient } from './query-client';
superjson.registerCustom({
    isApplicable: (v) => Prisma.Decimal.isDecimal(v),
    serialize: (v) => v.toJSON(),
    deserialize: (v) => new Prisma.Decimal(v),
}, 'decimal.js');
export const trpc = createTRPCReact();
let clientQueryClientSingleton;
function getQueryClient() {
    if (typeof window === 'undefined') {
        // Server: always make a new query client
        return makeQueryClient();
    }
    // Browser: use singleton pattern to keep the same query client
    return (clientQueryClientSingleton ??= makeQueryClient());
}
export const trpcClient = getQueryClient();
function getUrl() {
    const base = (() => {
        if (typeof window !== 'undefined')
            return '';
        if (process.env.VERCEL_URL)
            return `https://${process.env.VERCEL_URL}`;
        return 'http://localhost:3000';
    })();
    return `${base}/api/trpc`;
}
export function TRPCProvider(props) {
    // NOTE: Avoid useState when initializing the query client if you don't
    //       have a suspense boundary between this and the code that may
    //       suspend because React will throw away the client on the initial
    //       render if it suspends and there is no boundary
    const queryClient = getQueryClient();
    const [trpcClient] = useState(() => trpc.createClient({
        links: [
            httpBatchLink({
                transformer: superjson,
                url: getUrl(),
            }),
        ],
    }));
    return (<trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </trpc.Provider>);
}
