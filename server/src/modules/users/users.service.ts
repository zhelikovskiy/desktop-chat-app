import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/common/dto/users/create-user.dto';

@Injectable()
export class UsersService {
	constructor(private prismaService: PrismaService) {}

	async createOne(data: CreateUserDto) {
		const { email, username, password } = data;

		const existingEmail = await this.prismaService.user.findFirst({
			where: {
				email,
			},
		});
		const existingUsername = await this.prismaService.user.findFirst({
			where: {
				username,
			},
		});

		if (existingEmail)
			throw new Error('User with this email already exists');
		if (existingUsername)
			throw new Error('User with this username already exists');

		return this.prismaService.user.create({
			data,
		});
	}

	async findOneById(id: string) {
		return this.prismaService.user.findUnique({
			where: {
				id,
			},
		});
	}
	async findOneByEmail(email: string) {
		return this.prismaService.user.findUnique({
			where: {
				email,
			},
		});
	}
	async findOneByUsername(username: string) {
		return this.prismaService.user.findUnique({
			where: {
				username,
			},
		});
	}
	async findAll() {
		return this.prismaService.user.findMany();
	}

	async findManyByFilter() {}
	async updateOne() {}

	async deleteOne(id: string) {
		return this.prismaService.user.delete({
			where: {
				id,
			},
		});
	}
}
