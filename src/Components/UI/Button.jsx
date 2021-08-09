import classes from './Button.module.css';

const Button = props => {
  return (
    <a href={props.href} target={props.target} className={classes.button}>
      {props.children}
    </a>
  );
};

export default Button;