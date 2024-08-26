'use client';
import { useEffect, useState } from 'react';
import QrcodeReader from './qrreader';
import { useRouter } from "next/navigation";

export default function QrcodeReaderComponent() {
    const router = useRouter();
    const [scannedTime, setScannedTime] = useState(new Date());
    const [scannedResult, setScannedResult] = useState('');

    useEffect(() => {

        if(scannedResult != ''){

            // ここでカメラの停止とかちゃんとしたい

            // router.push('/owner/menu/qr-read/result/' + scannedResult);
        }
    }, [scannedTime, scannedResult]);

    // QRコードを読み取った時の実行する関数
    const onNewScanResult = (result: any) => {
        console.log('QRコードスキャン結果');
        console.log(result);
        setScannedTime(new Date());
        setScannedResult(result);
    };
    return (
        <>
        <div>
            <h2>
                スキャン日時：
                {
                    scannedTime.toLocaleString('ja-JP', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    })
                }
            </h2>
        </div>
        <QrcodeReader
            onScanSuccess={onNewScanResult}
            onScanFailure={(error: any) => {
            // console.log('Qr scan error');
            }}
        />
        </>
    );
}