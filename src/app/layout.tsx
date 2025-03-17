import React, { Suspense } from 'react';
import '@/styles/globals.scss';
import { M_600 } from "@/utils/globalFonts.ts";
import {AuthProvider} from "@/context/AuthContext.tsx";
import ClientLayout from './client-layout';

export const metadata = {
    title: {
        template: '%s | Erick Tran',
        default: `Erick Tran's Portfolio`,
    },
    description: `Erick Tran's Portfolio`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={M_600}>
            <Suspense fallback={<div>Loading...</div>}>
                <ClientLayout>
                    <AuthProvider>
                       {children}
                    </AuthProvider>
                </ClientLayout>
            </Suspense>
            </body>
        </html>
    );
}