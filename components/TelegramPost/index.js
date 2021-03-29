import styles from './index.module.css';

const TelegramPost = (props) => {
  const { telegramPost } = props;
  const { html, url, author, image } = telegramPost;

  return (
    <div className={styles.post}>
      {image && <img src={image} />}
      <blockquote
        className={styles.quote}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <span dangerouslySetInnerHTML={{ __html: author }} /> — 
      <a href={url}>{url}</a>
    </div>
  );
};

export default TelegramPost;
