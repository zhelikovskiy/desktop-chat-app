export const CLIENT_WS_EVENTS = {
	CHAT: {
		OPENED: 'chat:opened',
		CLOSED: 'chat:closed',
	},
} as const;

export type ClientWSEvent =
	(typeof CLIENT_WS_EVENTS)[keyof typeof CLIENT_WS_EVENTS];
