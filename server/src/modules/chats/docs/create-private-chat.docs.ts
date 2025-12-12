import { applyDecorators } from '@nestjs/common';
import {
	ApiOperation,
	ApiBody,
	ApiCreatedResponse,
	ApiBearerAuth,
} from '@nestjs/swagger';
import { CreatePrivateChatDto } from 'src/common/dto/chats/create-private-chat.dto';

export function ApiCreatePrivateChatDocs() {
	return applyDecorators(
		ApiBearerAuth(),
		ApiOperation({
			summary: 'Create Private Chat',
			description:
				'Creates a new private chat between two users and sends an initial message.',
		}),
		ApiBody({
			type: CreatePrivateChatDto,
			examples: {
				Example1: {
					summary: 'Basic Example',
					value: {
						targetId: 'user-12345',
						firstMessage: {
							content:
								'Hello! This is the start of our private chat.',
							tempId: 'temp-67890',
						},
					},
				},
			},
		}),
		ApiCreatedResponse({
			description: 'Private chat created successfully',
			schema: {
				example: {
					chatBody: {
						chatId: 'chat-abcdef123456',
						members: ['current-user-id', 'user-12345'],
						createdAt: '2024-01-01T12:00:00Z',
					},
				},
			},
		})
	);
}
