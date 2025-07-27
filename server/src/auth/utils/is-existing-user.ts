import { BadRequestException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

export const isExistingUser = async (
	{ email, username }: { email: string; username: string },
	userService: UsersService
): Promise<void> => {
	const existingEmail = await userService.findOneByEmail(email);
	if (existingEmail)
		throw new BadRequestException('User with this email already exists');

	const existingUsername = await userService.findOneByUsername(username);
	if (existingUsername)
		throw new BadRequestException('User with this username already exists');
};
