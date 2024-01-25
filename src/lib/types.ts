import { z } from 'zod';

interface Posts {
	name: string;
	url: string;
	tags: string[];
}



const notionQueryResponseSchema = z.object({
	results: z.array(
		z.object({
			url: z.string(),
			properties: z.object({
				Name: z.object({
					title: z.array(
						z.object({
							plain_text: z.string(),
						})
					),
				}),
				URL: z.object({
					url: z.string(),
				}),
				Tags: z.object({
					multi_select: z.array(
						z.object({
							name: z.string(),
						})
					),
				}),
			}),
		})
	),
});

type NotionQueryResponse = z.infer<typeof notionQueryResponseSchema>


// Because of hono `Bindings` type, so we need to use `type` instead of `interface`
type Env = {
	NOTION_TOKEN: string;
	NOTION_DATABASE_ID: string;
	DISCORD_WEBHOOK_URL: string;
};

export { Posts, NotionQueryResponse, Env, notionQueryResponseSchema };
