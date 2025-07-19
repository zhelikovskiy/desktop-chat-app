export interface IUser {
	id: string;
	username: string;
	email: string;
	password?: string;
	avatarUrl: string | null;
	status: string | null;
	bio: string | null;
	createdAt: Date;
	updatedAt: Date;
}
