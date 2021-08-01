import { useState, useRef, useCallback } from "react";
import { css } from "@emotion/react";
import BarLoader from "react-spinners/BarLoader";
import useNews from "../hooks/useNews";

const override = css`
	display: block;
	margin: 0 auto;
	border-color: red;
`;

const NewsList = () => {

	const [pageNumber, setPageNumber] = useState(1);

  const {
    news,
    hasMore,
    loading,
    error
  } = useNews(pageNumber);

  const observer = useRef();
  const lastNewsElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        console.log('intersecting');
        setPageNumber(prevPageNumber => prevPageNumber + 1);
      }
    })
    if (node) observer.current.observe(node);
    console.log(node);
  }, [loading, hasMore]);

	return (
		<div>
      {news.map((newsItem , index) => {
        if (news.length === index + 1) {
          return (
            <div key={newsItem.title}>
              <h1>{newsItem.title}</h1>
            </div>
            )
        } else {
        return (
        <div ref={lastNewsElementRef} key={newsItem.title}>
          <h1>{newsItem.title}</h1>
        </div>
        )}}
      )}
      <BarLoader
					color="#00a9e0"
					loading={loading}
					css={override}
					size={150}
				/>
      <div>{error && 'error...'}</div>
		</div>
	);
};

export default NewsList;
