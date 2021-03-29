import styles from './index.module.css';

const Tiktok = (props) => {
  const { tiktok } = props;
  const { url, thumbnail, author, title } = tiktok;

  return (
    <div className={styles.container}>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        title="Посмотреть видео в TikTok"
      >
        <img src={thumbnail} />
      </a>
      <p
        dangerouslySetInnerHTML={{
          __html: `@${author}: <a href="${url}">${title}</a>`,
        }}
      />
    </div>
  );
};

export default Tiktok;
