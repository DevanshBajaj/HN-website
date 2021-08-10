import { useState, useRef, useCallback } from "react";

import { css } from "@emotion/react";
import BarLoader from "react-spinners/BarLoader";
import moment from "moment";
import styled from "styled-components";

import useNews from "../hooks/useNews";
import News from "./News";

const Wrapper = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
	padding: 3rem 10rem;

	@media (max-width: 1215px) {
		display: grid;
  	grid-gap: 1rem;
  	grid-template-columns: repeat(auto-fit, minmax(60%, 1fr));
		padding: 1rem 2rem;
	}
`;

const MaxReached = styled.h1`
	color: #b00020;
	font-size: 1.5rem;
	padding: 2rem 0 0 2rem;
	@media (max-width: 649px) {
		font-size: 1.2rem;
	}
	@media (max-width: 546px) {
		font-size: 1rem;
	}
`;

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
			if (pageNumber === 14) {
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
		<Wrapper>
			{news.map((newsItem, index) => {
				let url = newsItem.url;
				let domain = newsItem.domain;
				let UrlPreview = newsItem.domain;
				let Username = newsItem.user;

				if (url.includes("item?id=") && newsItem.domain === undefined) {
					url = `https://news.ycombinator.com/${newsItem.url}`;
					domain = `https://news.ycombinator.com/`;
					UrlPreview = 'news.ycombinator.com';
				} else {
					domain = `https://${newsItem.domain}`;
				}

				if (newsItem.user === null) {
					Username = "Unknown";
				} else {
					Username = newsItem.user;
				}

				let date = moment(newsItem.time * 1000).format("MMMM Do YYYY, h:mm A");

				if (news.length === index) {
					return (
						<News
							key={index}
							id={newsItem.id}
							ref={lastNewsElementRef}
							title={newsItem.title}
							user={Username}
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
							key={index}
							id={newsItem.id}
							ref={lastNewsElementRef}
							title={newsItem.title}
							user={Username}
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
				<MaxReached>Max Pages Reached</MaxReached>
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
		</Wrapper>
	);
};

export default NewsList;
