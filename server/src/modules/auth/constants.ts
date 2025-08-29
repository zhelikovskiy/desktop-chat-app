export const jwtConstants = {
	secret: process.env.JWT_SECRET || 'YOUR_SECRET_KEY_HERE',
	expiresIn: '1h',
	refreshTokenExpiresIn: '1d',
	verifyTokenExpiresIn: '15m',
	verifyTokenSecret: process.env.VERIFY_TOKEN_SECRET || 'YOUR_VERIFY',
};
