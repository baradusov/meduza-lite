import { getLatestNews } from 'lib/api';
import { formatDate } from 'lib/helpers';
import Page from 'components/Page';
import styles from 'styles/Home.module.css';

const Home = (props) => {
  const { news, currentPage } = props;
  const nextPage = `/p/${Number(currentPage) + 1}`;
  const previousPage = currentPage == 1 ? '/' : `/p/${Number(currentPage) - 1}`;

  return (
    <Page>
      <ul className={styles.list}>
        {news.map((newsItem) => {
          const { title, secondTitle, date, time, url } = newsItem;

          return (
            <li key={url} className={styles.listItem}>
              <a href={`/${url}`}>
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

      <div className={styles.pager}>
        <a className={styles.pagerLink} href={previousPage}>
          Предыдущая страница
        </a>
        <a className={styles.pagerLink} href={nextPage}>
          Следующая страница
        </a>
      </div>
    </Page>
  );
};

export const getStaticProps = async ({ params }) => {
  const { slug } = params;
  const data = await getLatestNews(slug);

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
      currentPage: slug,
    },
    revalidate: 60 * 30, // каждые 30 минут
  };
};

export const getStaticPaths = async () => {
  return { paths: ['/p/1'], fallback: 'blocking' };
};

export const config = {
  unstable_runtimeJS: false,
};

export default Home;
