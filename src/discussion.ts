
interface Discussion {

}

const formateResponse = (data: unknown): Discussion[] => {
	return data.results.map((result: unknown) => ({
		//文章標題
		name: result.properties.Name.title[0].plain_text,
		//文章連結
		url: result.url,

	}));
};

const formateDiscussions():string{

}
