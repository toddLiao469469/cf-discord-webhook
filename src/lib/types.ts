interface Posts {
	name: string;
	url: string;
	tags: string[];
}

export type Env =  {
	NOTION_TOKEN: string;
	NOTION_DATABASE_ID: string;
	DISCORD_WEBHOOK_URL: string;
}

export { Posts };
