import { writeFileSync } from 'fs';
import { getLatestNews, getRss } from 'lib/api';
import { formatDate } from 'lib/helpers';
import Page from 'components/Page';
import styles from 'styles/Home.module.css';

const Home = (props) => {
  const { news } = props;

  return (
    <Page>
      <ul className={styles.list}>
        {news.map((newsItem) => {
          const { title, secondTitle, date, time, url } = newsItem;

          return (
            <li key={url} className={styles.listItem}>
              <a href={url}>
                <div className={styles.titleContainer}>
                  <h2 className={styles.newsTitle}>{title}</h2>
                  {secondTitle && (
                    <p className={styles.secondTitle}>{secondTitle}</p>
                  )}
                </div>
                <p className={styles.newsDate}>
                  {time}, {date}
                </p>
              </a>
            </li>
          );
        })}
      </ul>
    </Page>
  );
};

export const getStaticProps = async () => {
  const data = await getLatestNews();
  const rss = await getRss();
  writeFileSync('./public/rss.xml', rss);

  const news = data.map((item) => {
    const { title, datetime, url, second_title } = item;
    const { date, time } = formatDate(datetime);

    return {
      title,
      secondTitle: second_title || null,
      url,
      time,
      date,
    };
  });

  return {
    props: {
      news,
    },
    revalidate: 60 * 30, // каждые 30 минут
  };
};

export const config = {
  unstable_runtimeJS: false,
};

export default Home;
