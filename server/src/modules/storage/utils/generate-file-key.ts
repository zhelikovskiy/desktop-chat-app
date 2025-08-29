import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

export const generateFileKey = (originalName: string, category: string) => {
	const fileExtension = path.extname(originalName);
	const uniqueId = uuidv4();
	const fileName = `${uniqueId}${fileExtension}`;

	return `${category}/${fileName}`;
};
