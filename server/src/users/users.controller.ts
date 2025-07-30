import { Controller, Delete, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private userService: UsersService) {}

	@Get()
	getAll() {
		return this.userService.findAll();
	}

	@Delete(':id')
	deleteOne(@Param('id') userId: string) {
		return this.userService.deleteOne(userId);
	}
}
