'use client';
import { Toaster } from 'react-hot-toast';

interface ToastProviderProps {
    children: React.ReactNode;
}

export default function ToastProvider({ children }: ToastProviderProps) {
    return (
        <div>
            <Toaster
                position="top-left"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                }}
            />
            {children}
        </div>
    );
}
