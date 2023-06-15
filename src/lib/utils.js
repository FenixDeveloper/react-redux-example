export const declOfNum = (number, titles) => {
	const N = Math.abs(number);
	const cases = [2, 0, 1, 1, 1, 2];

	return titles[
		N % 100 > 4 && N % 100 < 20 ? 2 : cases[N % 10 < 5 ? N % 10 : 5]
	];
};
