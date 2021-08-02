const News = React.forwardRef((props, ref) => {
	return (
		<div ref={ref} key={props.id}>
			<h1>{props.title}</h1>
			<p>By: {props.user}</p>
			<p>
				Link to the article: &nbsp;
				<a href={props.url} target={props.id}>
					{props.domain}
				</a>
			</p>
			<a
				href={`https://news.ycombinator.com/item?id=${props.id}`}
				target={`${props.id}-comments`}
			>
				{props.comments_count} Comments
			</a>
			<p>{props.date}</p>
			<p>Posted: {props.time_ago}</p>
		</div>
	);
});

export default News;
