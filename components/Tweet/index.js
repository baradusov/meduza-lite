import styles from './index.module.css';

const Tweet = (props) => {
  const { tweet } = props;

  return (
    <blockquote
      className={styles.tweet}
      dangerouslySetInnerHTML={{ __html: tweet.html }}
    />
  );
};

export default Tweet;
