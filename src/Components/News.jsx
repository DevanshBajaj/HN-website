import classes from './News.module.css';
import Button from './UI/Button';
import {ExternalLinkIcon} from '@heroicons/react/outline';

const News = React.forwardRef((props, ref) => {
	return (
		<div ref={ref} key={props.id} className={classes.wrapper}>
			<h1>{props.title}</h1>
			<p>By: {props.user}</p>
			<p>Published on &nbsp; <a href={props.domain} target={`${props.id}-domain`}>{props.UrlTitle}</a></p>
			<p>
				<Button href={props.url} target={props.id}>
					Article <ExternalLinkIcon style={{height: '16px', width:'16px'}}/>
				</Button>
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
