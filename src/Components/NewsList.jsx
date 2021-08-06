import { useState, useRef, useCallback } from "react";

import { css } from "@emotion/react";
import BarLoader from "react-spinners/BarLoader";
import moment from "moment";

import useNews from "../hooks/useNews";
import News from "./News";

const override = css`
	display: block;
	margin: 0 auto;
	border-color: red;
`;

const NewsList = () => {
	const [pageNumber, setPageNumber] = useState(1);
	const [pagesReached, setPagesReached] = useState(false);
	const { news, hasMore, loading, error } = useNews(pageNumber);

	const observer = useRef();

	const lastNewsElementRef = useCallback(
		(node) => {
			if (loading) return;
			if (observer.current) observer.current.disconnect();
			if (pageNumber === 10) {
				setPagesReached(true);
			} else {
				observer.current = new IntersectionObserver((entries) => {
					if (entries[0].isIntersecting && hasMore) {
						console.log("intersecting");
						setPageNumber((prevPageNumber) => prevPageNumber + 1);
					}
				});
				if (node) observer.current.observe(node);
				console.log(node);
			}
		},
		[loading, hasMore]
	);

	return (
		<div>
			{news.map((newsItem, index) => {
				let url = newsItem.url;
				let domain = newsItem.domain;
				let UrlPreview = newsItem.domain;

				if (url.includes("item?id=") && newsItem.domain === undefined) {
					url = `https://news.ycombinator.com/${newsItem.url}`;
					domain = `news.ycombinator.com`;
				} else {
					domain = `https://${newsItem.domain}`;
				}
				let date = moment(newsItem.time * 1000).format("MMMM Do YYYY, h:mm A");

				if (news.length === index) {
					return (
						<News
							id={newsItem.id}
							ref={lastNewsElementRef}
							title={newsItem.title}
							user={newsItem.user}
							url={url}
							UrlTitle={UrlPreview}
							date={date}
							domain={domain}
							comments_count={newsItem.comments_count}
							time_ago={newsItem.time_ago}
						/>
					);
				} else {
					return (
						<News
							id={newsItem.id}
							ref={lastNewsElementRef}
							title={newsItem.title}
							user={newsItem.user}
							url={url}
							date={date}
							UrlTitle={UrlPreview}
							domain={domain}
							comments_count={newsItem.comments_count}
							time_ago={newsItem.time_ago}
						/>
					);
				}
			})}
			{pagesReached ? (
				<h1>Max Pages Reached</h1>
			) : (
				<div>
					<BarLoader
						color="#00a9e0"
						loading={loading}
						css={override}
						size={150}
					/>
					<div>{error && "error..."}</div>
				</div>
			)}
		</div>
	);
};

export default NewsList;
