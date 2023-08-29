import { Posts } from './lib/types';
import { Client } from '@notionhq/client';

function getRandomDateInRange(minDate: Date, maxDate: Date): Date {
	const minTimestamp = minDate.getTime();
	const maxTimestamp = maxDate.getTime();

	const randomTimestamp = minTimestamp + Math.random() * (maxTimestamp - minTimestamp);

	return new Date(randomTimestamp);
}

const formateResponse = (data: unknown): Posts[] => {
	return data.results.map((result: unknown) => ({
		name: result.properties.Name.title[0].plain_text,
		url: result.url,
		originUrl: result.properties.URL.url,
		tags: result.properties.Tags.multi_select.map((item: unknown) => item.name),
	}));
};

const getPosts = async (token: string, dataBaseId: string) => {
	const minDate = new Date('2020-01-01');
	const maxDate = new Date();

	const randomStartDate = getRandomDateInRange(minDate, maxDate);
	const randomEndDate = getRandomDateInRange(randomStartDate, maxDate);
	const notion = new Client({
		auth: token,
	});
	const myPages = await notion.databases.query({
		database_id: dataBaseId,
		filter: {
			property: 'Created',
			date: {
				after: randomStartDate.toISOString(),
				before: randomEndDate.toISOString(),
			},
		},
		page_size: 3,
		sorts: [
			{
				property: 'Created',
				direction: 'descending',
			},
		],
	});
	return formateResponse(myPages);
};

export { getPosts };
