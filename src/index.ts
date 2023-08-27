import { Router } from 'itty-router';
import { getPosts } from './getPosts';
import { sendMessage } from './sendMessage';

const router = Router();

router.get('/posts', async (request, env, context) => {
	const result = await getPosts(env.NOTION_TOKEN, env.NOTION_DATABASE_ID);

	await sendMessage({ message: '今日文章', data: result }, env.DISCORD_WEBHOOK_URL);

	return new Response(`${JSON.stringify(result)}`, { status: 200 });
});

router.all('*', () => new Response('404, not found!', { status: 404 }));

export default {
	fetch(request: Request, env: unknown) {
		return router.handle(request, env);
	},
	async scheduled(event: unknown, env, ctx) {
		const result = await getPosts(env.NOTION_TOKEN, env.NOTION_DATABASE_ID);
		await sendMessage({ message: '今日文章', data: result }, env.DISCORD_WEBHOOK_URL);
	},
};
