import { Posts } from './lib/types';

const sendMessage = async (
	{
		message,
		data,
	}: {
		message: string;
		data: Posts[];
	},
	url: string
) => {
	console.log(data.length);
	const result = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			content: message,
			color: 15258703,
			embeds: data.map(item => ({
				color: 7072518,
				fields: [
					{
						name: item.name,
						value: item.url,
					},
					{
						name: 'tags',
						value: item.tags.join(','),
					},
				],
			})),
		}),
	});
};

export { sendMessage };
