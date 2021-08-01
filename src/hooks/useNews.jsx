import { useEffect, useState } from "react";
import axios from "axios";

export default function useNews(pageNumber) {
  const apiKey = import.meta.env.VITE_API_KEY;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [news, setNews] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel
    axios({
      method: 'GET',
      url: 'https://newsapi.org/v2/top-headlines?country=in',
      params: {pageSize: 10, page: pageNumber, apiKey: apiKey },
      cancelToken: new axios.CancelToken(c => cancel = c)
    }).then(response => {
      setNews(prevNews => {
        return [...new Set([...prevNews, ...response.data.articles])];
      });
      setHasMore(response.data.articles.length > 0);
      setLoading(false)
      console.log(response.data);
    }).catch(error => {
      if (axios.isCancel(error)) return
      setError(true);
    })
    return () => cancel()
  }, [pageNumber]);

  return {loading, error, news, hasMore};
}