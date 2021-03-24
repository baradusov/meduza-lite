import styles from './index.module.css';

const TelegramPost = (props) => {
  const { telegramPost } = props;
  const { html, telegramUrl, channel } = telegramPost;

  return (
    <div className={styles.post}>
      <blockquote
        className={styles.quote}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <span dangerouslySetInnerHTML={{ __html: channel }} /> — 
      <a href={telegramUrl}>{telegramUrl}</a>
    </div>
  );
};

export default TelegramPost;
