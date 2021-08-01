import { useState, useRef, useCallback } from "react";

import { css } from "@emotion/react";
import BarLoader from "react-spinners/BarLoader";

import useNews from "../hooks/useNews";
import Placeholder from "../assets/placeholder.jpg";

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
				if (news.length === index) {
					return (
						<div key={index}>
							<h1>{newsItem.title}</h1>
						</div>
					);
				} else {
					let url = newsItem.urlToImage;
					if (url === null) {
						url = Placeholder;
					}
					return (
						<div ref={lastNewsElementRef} key={index}>
							<img
								style={{ height: "146px", width: "146px" }}
								src={url}
								alt="Image"
							/>
							<h1>{newsItem.title}</h1>
						</div>
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
