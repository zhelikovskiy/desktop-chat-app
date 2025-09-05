import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { CreateGroupChatDto } from 'src/common/dto/chats/create-group-chat.dto';

export function ApiCreateGroupChatDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Create Group Chat',
			description: 'Creates a new group chat with multiple users.',
		}),
		ApiBody({ type: CreateGroupChatDto }),
		ApiOkResponse({
			description: 'Chat created successfully',
		})
	);
}
