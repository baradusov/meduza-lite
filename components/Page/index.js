import Head from 'next/head';
import { lastUpdated } from 'lib/helpers';
import { titles } from 'lib/titles';
import styles from './index.module.css';
import Menu from 'components/Menu';

const Page = (props) => {
  const { children } = props;
  const { time, date } = lastUpdated();
  const menuItems = Object.keys(titles);

  return (
    <div className={styles.container}>
      <Head>
        <title>Meduza, лёгкая версия</title>
        <meta name="description" content="Лёгкая версия Медузы" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Meduza, лёгкая версия"
          href="https://meduza-lite.vercel.app/api/rss"
        />
      </Head>

      <header className={styles.header}>
        <h1 className={styles.title}>
          <a className={styles.titleLink} href="/">
            Meduza
          </a>
        </h1>

        <p className={styles.subtitle}>
          лёгкая версия |{' '}
          <a style={{ color: '#b88b59' }} href="https://meduza.io">
            полная версия
          </a>
        </p>

        <Menu titles={titles} items={menuItems} />

        <p>
          <a
            href="https://support.meduza.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            Помочь «Медузе»
          </a>
        </p>
      </header>

      <main className={styles.main}>{children}</main>

      <footer style={{ textAlign: 'center' }}>
        <p>
          Обновление каждые 30 минут
          <br />
          Последнее было:
          <br />
          {time} по мск, {date}
        </p>
        <p>
          Связаться можно <a href="https://t.me/baradusov">через телеграм</a>
        </p>
        <a href="https://baradusov.ru">baradusov.ru</a>
        <p>
          <a href="/api/rss" target="_blank" rel="noopener noreferrer">
            RSS
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Page;
