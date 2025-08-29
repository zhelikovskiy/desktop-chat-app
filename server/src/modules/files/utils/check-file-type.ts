import { BadRequestException } from '@nestjs/common';
import { FileCategories } from 'src/common/enums/file-categories';

export const checkFileType = (mimeType: string, category: FileCategories) => {
	if (
		category === FileCategories.AVATAR &&
		mimeType !== 'image/jpeg' &&
		mimeType !== 'image/png'
	)
		throw new BadRequestException('Only JPEG and PNG images are allowed.');
};
