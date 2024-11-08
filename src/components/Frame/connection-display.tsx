import { useState, useEffect, useRef } from 'react';

export default function ConnectionStatus(): JSX.Element {
	const [isConnected, setIsConnected] = useState(false);
	const [connectionTimedOut, setConnectionTimedOut] = useState(false);
	const connectionTimeout = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		window.ipcRenderer.on('tcp-connected', (_event: any, connected: boolean) => {
			setIsConnected(connected);
		});

		window.ipcRenderer.invoke("ask-tcp-connected").then((connected: boolean) => { 
			setIsConnected(connected);
		});
	}, []);

	useEffect(() => {
		if(connectionTimeout.current) {
			clearTimeout(connectionTimeout.current);
		}

		if(!isConnected) {
			connectionTimeout.current = setTimeout(() => {
				setConnectionTimedOut(true);
			}, 5000);
		}

	}, [isConnected]);

	return (
		<div>
			{isConnected ? (
				<span title="TCP Connected" className="p-4">
					<svg className='fill-custom-frame-green' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM254-346l-84-86q59-59 138.5-93.5T480-560q92 0 171.5 35T790-430l-84 84q-44-44-102-69t-124-25q-66 0-124 25t-102 69ZM84-516 0-600q92-94 215-147t265-53q142 0 265 53t215 147l-84 84q-77-77-178.5-120.5T480-680q-116 0-217.5 43.5T84-516Z"/></svg>
				</span>
			) : (
				<span title="TCP Disconnected" className="p-4">
					<svg className='fill-custom-frame-red' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M790-56 414-434q-47 11-87.5 33T254-346l-84-86q32-32 69-56t79-42l-90-90q-41 21-76.5 46.5T84-516L0-602q32-32 66.5-57.5T140-708l-84-84 56-56 736 736-58 56Zm-310-64q-42 0-71-29.5T380-220q0-42 29-71t71-29q42 0 71 29t29 71q0 41-29 70.5T480-120Zm236-238-29-29-29-29-144-144q81 8 151.5 41T790-432l-74 74Zm160-158q-77-77-178.5-120.5T480-680q-21 0-40.5 1.5T400-674L298-776q44-12 89.5-18t92.5-6q142 0 265 53t215 145l-84 86Z"/></svg>
				</span>
			)}
		</div>
	);
}
