'use client';

import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

export function QrcodeGenerator({ value }: { value: string }) {
    return (
        <QRCodeCanvas
            value={value}
            size={256}
            // bgColor={"#FF0000"}
            // fgColor={"#FFC0CB"}
            level={'L'}
            includeMargin={false}
            imageSettings={{
                src: '/favicon.ico',
                x: undefined,
                y: undefined,
                height: 24,
                width: 24,
                excavate: true,
            }}
        />
    );
}
