export function handleValue(value: any): any {
	if (Array.isArray(value)) {
		return value.length > 0 ? value[0] : null;
	} else if (typeof value === 'string') {
		return value;
	} else {
		return value;
	}
}
