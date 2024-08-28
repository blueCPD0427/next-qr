'use client';
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { Html5Qrcode } from 'html5-qrcode';
import Select from 'react-select';

// QRコードリーダーの表示領域のhtmlのID
const qrcodeRegionId = 'html5qr-code-full-region';

export default function QrcodeReaderComponent() {
    const router = useRouter();
    const [scannedTime, setScannedTime] = useState(new Date());


    // QRコードを読み取った時の実行する関数
    const onNewScanResult = async (result: any) => {
        // console.log('QRコードスキャン結果');
        // console.log(result);
        setScannedTime(new Date());

        // カメラ一時停止
        await html5QrcodeScanner.pause(true,false);

        // 読み取り結果でリダイレクト
        router.push('/owner/menu/qr-read/result/' + result);

        // ここでカメラの停止処理を行う必要があるかは要検討
        // await html5QrcodeScanner.stop();
    };

    // QRコードリーダーの設定
    // fpsは読み取り頻度。デフォルトは　2.１秒間に何回読み取るかの値を設定。１ならば１秒間に１回読み取る。
    // qrboxは読み取り範囲の設定。widthとheightを設定する。
    const config = { fps: 1, qrbox: { width: 250, height: 250 } };

    // カメラの許可
    const [cameraPermission, setCameraPermission] = useState(false);

    // 選択したカメラID保存用
    const [selectedCameraId, setSelectedCameraId] = useState('');

    // 使用できるカメラ一覧
    const [cameras, setCameras] = useState<any>([]);

    // QRコードリーダーインスタンス
    const [html5QrcodeScanner, setHtml5QrcodeScanner] = useState<any>(null);

    // カメラ情報を取得するための関数
    const getCameras = async () => {
        await Html5Qrcode.getCameras()
        .then((cameras) => {
            if (cameras && cameras.length) {
            const formattedCameras = cameras.map((camera) => ({
                value: camera.id,
                label: camera.label || `Camera ${camera.id}`,
            }));
            setCameras(formattedCameras);
            setSelectedCameraId(formattedCameras[0].value);
            setCameraPermission(true);
            }
        })
        .catch((err) => {
            console.error(err);
        });
    };

    // スキャン開始
    const startScan = async () => {
        try {
            await html5QrcodeScanner.start(
                selectedCameraId,
                config,
                onNewScanResult,
                (error: any) => {
                    console.log('読み取り中');
                },
            );
            setHtml5QrcodeScanner(html5QrcodeScanner);
        } catch (error) {
            console.error('Error starting the scanner: ', error);
        }
    };

    // スキャン停止
    const stopScan = async () => {
        console.log('stop scan');
        try {
            await html5QrcodeScanner.stop();
            setHtml5QrcodeScanner(html5QrcodeScanner);
        } catch (error) {
            console.error('Error stopping the scanner: ', error);
        }
    };

    // カメラ切り替え
    const switchCamera = (targetId: string) => {
        console.log(targetId);
        setSelectedCameraId(targetId);
    };

    useEffect(() => {
        const scanner = new Html5Qrcode(qrcodeRegionId);
        setHtml5QrcodeScanner(scanner);

        return () => {
            scanner.clear();
        };
    }, []);

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
        <div className='container mx-auto'>
            <div className='max-w-screen-lg' id={qrcodeRegionId} />
            <div>
                {cameras.length > 0 ? (
                <Select
                    name='camera'
                    options={cameras}
                    value={cameras.find(
                    (camera: any) => camera.value === selectedCameraId,
                    )}
                    placeholder='カメラを選択'
                    onChange={async (camera) => await switchCamera(camera.value)}
                />
                ) : (
                <p>カメラがありません</p>
                )}
            </div>
            <div>
                <button
                className='bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-1 px-2 rounded mr-2'
                onClick={() => getCameras()}
                >
                カメラ取得
                </button>
                <button
                className='bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-1 px-2 rounded mr-2'
                onClick={async () => await startScan()}
                disabled={!cameraPermission && selectedCameraId == ''}
                >
                スキャン開始
                </button>
                <button
                className='bg-red-500 hover:bg-red-700 text-white text-sm font-bold py-1 px-2 rounded'
                onClick={async () => await stopScan()}
                >
                スキャン停止
                </button>
            </div>
        </div>
        </>
    );
}