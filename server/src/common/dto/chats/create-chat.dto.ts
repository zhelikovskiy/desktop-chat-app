import { ChatType } from 'src/common/enums/chat-types';
import { CreatePrivateChatDto } from './create-private-chat.dto';
import { CreateGroupChatDto } from './create-group-chat.dto';

export type CreateChatDto =
	| (CreatePrivateChatDto & { type: ChatType.PRIVATE })
	| (CreateGroupChatDto & { type: ChatType.GROUP });
