import { Client } from '@notionhq/client';
import { Effect, pipe } from 'effect';

import { NotionQueryResponse, Posts, notionQueryResponseSchema } from './lib/types';

const dateOffset = 24 * 60 * 60 * 1000 * 30;

function getRandomDateInRange(minDate: Date, maxDate: Date): Date {
	const minTimestamp = minDate.getTime();
	const maxTimestamp = maxDate.getTime();

	const randomTimestamp = minTimestamp + Math.random() * (maxTimestamp - minTimestamp);

	return new Date(randomTimestamp);
}

const formateResponse = (data: NotionQueryResponse): Posts[] => {
	return data.results.map(result => ({
		name: result.properties.Name.title[0].plain_text,
		url: result.url,
		originUrl: result.properties.URL.url,
		tags: result.properties.Tags.multi_select.map(item => item.name),
	}));
};

const getPosts = async (token: string, dataBaseId: string) => {
	return pipe(
		new Client({
			auth: token,
		}),
		client =>
			Effect.tryPromise({
				try: () => {
					const randomStartUpLimitDate = new Date(Date.now() - dateOffset);

					const randomStartDate = pipe(
						[new Date('2020-01-01'), randomStartUpLimitDate] satisfies [Date, Date],
						([minDate, maxDate]) => getRandomDateInRange(minDate, maxDate)
					);
					const randomEndDate = pipe(randomStartDate, date =>
						getRandomDateInRange(date, new Date())
					);

					const result = client.databases.query({
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

					return result;
				},
				catch: e => new Response(e.message, { status: 500 }),
			}),
		Effect.map(data => {
			try {
				return notionQueryResponseSchema.parse(data);
			} catch (e: unknown) {
				throw new Error('notionQueryResponseSchema parse error', e);
			}
		}),
		Effect.map(formateResponse),
		Effect.runPromise
	);
};

export { getPosts };
