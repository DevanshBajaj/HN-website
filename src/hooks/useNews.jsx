import { useEffect, useState } from "react";
import axios from "axios";

export default function useNews(pageNumber) {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [news, setNews] = useState([]);
	const [hasMore, setHasMore] = useState(false);

	function sleeper(ms) {
		return function (x) {
			return new Promise(resolve => setTimeout(() => resolve(x), ms));
		};
	}

	useEffect(() => {
		setLoading(true);
		setError(false);
		let cancel;
		axios({
			method: "GET",
			url: "https://api.hackerwebapp.com/news?",
			params: {
				page: pageNumber,
			},
			cancelToken: new axios.CancelToken((c) => (cancel = c)),
		})
			.then(sleeper(100)).then((response) => {
				setNews((prevNews) => {
					return [...new Set([...prevNews, ...response.data])];
				});
				setHasMore(response.data.length > 0);
				setLoading(false);
			})
			.catch((error) => {
				if (axios.isCancel(error)) return;
				setError(true);
			});
		return () => cancel();
	}, [pageNumber]);

	return { loading, error, news, hasMore };
}
