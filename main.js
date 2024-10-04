export default {
	async fetch(request, env) {
		const url = "https://api.openai.com/v1/chat/completions";

		async function readRequestBody(request) {
			const contentType = request.headers.get("content-type");
			if (contentType && contentType.includes("application/json")) {
				return await request.json();
			} else {
				return "";
			}
		}

		async function gatherResponse(response) {
			const { headers } = response;
			const contentType = headers.get("content-type") || "";
			if (contentType && contentType.includes("application/json")) {
				const aux = await response.json();

				return aux["choices"][0]["message"]["content"];
			} else {
				return response.text();
			}
		}

		const body = await readRequestBody(request);

		const prompt = {
			model: "gpt-4o-mini",
			messages: [
				{
					role: "user",
					content: `Your prompt`,
				},
			],
		};

		const init = {
			body: JSON.stringify(prompt),
			method: "POST",
			headers: {
				"content-type": "application/json;charset=UTF-8",
				Authorization: "Bearer YOUR-TOKEN",
			},
		};

		const response = await fetch(url, init);
		const results = await gatherResponse(response);

		return new Response(results);
	},
};
