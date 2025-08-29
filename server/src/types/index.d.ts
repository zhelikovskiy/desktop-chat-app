import { IPayload } from 'src/common/interfaces/payload.interface';

declare global {
	namespace Express {
		export interface Request {
			user: { sub: string; username: string; email: string };
		}
	}
}
