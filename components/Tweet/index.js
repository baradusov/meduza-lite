import styles from './index.module.css';

const Tweet = (props) => {
  const { tweet } = props;
  const { html, photos, video, url } = tweet;

  const renderMedia = () => {
    if (photos && photos.length > 0) {
      return (
        <a href={url}>
          {photos.map((photo, key) => {
            return <img key={key} src={photo.url} />;
          })}
        </a>
      );
    }

    if (video) {
      return (
        <a href={url}>
          <img src={video.poster} />
        </a>
      );
    }

    return null;
  };

  return (
    <div className={styles.tweet}>
      {renderMedia()}
      <blockquote dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};

export default Tweet;
