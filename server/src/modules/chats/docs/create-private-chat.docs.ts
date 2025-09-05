import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { CreatePrivateChatDto } from 'src/common/dto/chats/create-private-chat.dto';

export function ApiCreatePrivateChatDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Create Private Chat',
			description: 'Creates a new private chat between two users.',
		}),
		ApiBody({ type: CreatePrivateChatDto }),
		ApiOkResponse({
			description: 'Chat created successfully',
		})
	);
}
