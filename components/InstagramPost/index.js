import styles from './index.module.css';

const InstagramPost = (props) => {
  const { instagramPost } = props;
  const { instagramUrl, imageUrl, author } = instagramPost;

  if (imageUrl) {
    return (
      <figure className={styles.figure}>
        <a className={styles.link} href={instagramUrl}>
          <img src={imageUrl} />
        </a>

        <figcaption>
          <a href={`https://instagram.com/${author}`}>{`@${author}`}</a>
        </figcaption>
      </figure>
    );
  }

  return (
    <a
      href={instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{ display: 'inline-block', marginBottom: 10 }}
    >
      Посмотреть пост в Instagram
    </a>
  );
};

export default InstagramPost;
