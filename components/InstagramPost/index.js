import styles from './index.module.css';

const InstagramPost = (props) => {
  const { instagramPost } = props;
  const { instagramUrl, imageUrl, author } = instagramPost;

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
};

export default InstagramPost;
