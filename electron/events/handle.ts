import { BrowserWindow } from "electron";
import EzTcpClient from "../net/ezTcp";
import { ezSerialize } from "../net/ez-proto/ezproto";

interface JobState {
	level: number;
	jobName: string;
	currentXP: number;
	maxXP: number;
}

export default function initHandlers(win: BrowserWindow, ipcMain: any, TcpClient: EzTcpClient) {
	ipcMain.handle("get-main-job-info", async (): Promise<JobState | undefined> => {
		if(!TcpClient.isConnected()) {
			throw new Error("No connection available");
		}

		let response;
		try {
			response = await TcpClient.sendAndAwaitResponse(Buffer.from("get-main-job-info"));
			return response && JSON.parse(response.toString());
		} catch(e) {
			if(response) {
				console.log(response!.toString());
			}
			console.log("Error getting job data:", (e as any).message)
			return undefined;
		}
	});

	ipcMain.handle("get-location", async (): Promise<JobState | undefined> => {
		if(!TcpClient.isConnected()) {
			throw new Error("No connection available");
		}

		let response;
		try {
			response = await TcpClient.sendAndAwaitResponse(Buffer.from("get-location"));
			return response && JSON.parse(response.toString());
		} catch(e) {
			if(response) {
				console.log(response!.toString());
			}
			console.log("Error getting location data:", e)
			return undefined;
		}
	});

	ipcMain.on('send-tcp-message', async (data: any) => {
		try {
			TcpClient?.sendMessage(ezSerialize(data));
		} catch(e:any) {
			console.log(e);
		}
	});

	// ipcMain.handle('get-main-job-info', () => {
	// 	return {
	// 		level: Math.floor(Math.random() * (90 - 10 + 1)) + 10,
	// 		jobName: 'CONJURER',
	// 		currentXP: Math.floor(Math.random() * (55000 - 10000 + 1)) + 10000,
	// 		maxXP: 55000
	// 	}
	// });

	ipcMain.handle('ask-tcp-connected', () => {
		return TcpClient?.isConnected() || false;
	});

	ipcMain.on('exit', () => {
		win.close();
	});

	ipcMain.on('minimize', () => {
		win.isMinimized() ? win.restore() : win.minimize()
	});

	ipcMain.on('maximize', () => {
		win.isMaximized() ? win.unmaximize() : win.maximize();
	});
}