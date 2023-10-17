import { Client } from '@notionhq/client';
import { Effect, pipe } from 'effect';

import { Posts } from './lib/types';

function getRandomDateInRange(minDate: Date, maxDate: Date): Date {
	const minTimestamp = minDate.getTime();
	const maxTimestamp = maxDate.getTime();

	const randomTimestamp = minTimestamp + Math.random() * (maxTimestamp - minTimestamp);

	return new Date(randomTimestamp);
}

const randomStartDate = pipe(
	[new Date('2020-01-01'), new Date()] satisfies [Date, Date],
	([minDate, maxDate]) => getRandomDateInRange(minDate, maxDate)
);

const randomEndDate = pipe(randomStartDate, date => getRandomDateInRange(date, new Date()));

const formateResponse = (data: unknown): Posts[] => {
	return data.results.map((result: unknown) => ({
		name: result.properties.Name.title[0].plain_text,
		url: result.url,
		originUrl: result.properties.URL.url,
		tags: result.properties.Tags.multi_select.map((item: unknown) => item.name),
	}));
};

const getPosts = async (token: string, dataBaseId: string) => {
	return pipe(
		new Client({
			auth: token,
		}),
		client =>
			Effect.tryPromise({
				try: () =>
					client.databases.query({
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
					}),
				catch: e => new Response(e.message, { status: 500 }),
			}),
		Effect.map(formateResponse),
		Effect.runPromise
	);
};

export { getPosts };
