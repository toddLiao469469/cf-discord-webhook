import { Hono } from 'hono';

import { getPosts } from './getPosts';
import { sendMessage } from './sendMessage';
import { Env } from './lib/types';

const app = new Hono<{ Bindings: Env }>();

app.get('/posts', async c => {
	const { env } = c;

	const result = await getPosts(env.NOTION_TOKEN, env.NOTION_DATABASE_ID);

	await sendMessage({ message: '今日文章', data: result }, env.DISCORD_WEBHOOK_URL);

	return new Response(`${JSON.stringify(result)}`, { status: 200 });
});

app.all('*', () => new Response('404, not found!', { status: 404 }));

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		return app.fetch(request, env, ctx);
	},
	async scheduled(event: unknown, env: Env) {
		const result = await getPosts(env.NOTION_TOKEN, env.NOTION_DATABASE_ID);
		await sendMessage({ message: '今日文章', data: result }, env.DISCORD_WEBHOOK_URL);
	},
};
