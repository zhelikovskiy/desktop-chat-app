export const SERVER_WS_EVENTS = {
	NOTIFICATION: {
		NEW_MESSAGE: 'notification:new_message',
		CHAT_CREATED: 'notification:chat_created',
	},
	MESSAGE: {
		RECEIVED: 'message:received',
	},
	CHAT: {},
} as const;

export type ServerWSEvent =
	(typeof SERVER_WS_EVENTS)[keyof typeof SERVER_WS_EVENTS];
