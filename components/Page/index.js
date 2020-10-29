import Head from 'next/head';
import { lastUpdated } from 'lib/helpers';
import styles from './index.module.css';

const Page = (props) => {
  const { children } = props;
  const { time, date } = lastUpdated();

  return (
    <div className={styles.container}>
      <Head>
        <title>Meduza, лёгкая версия</title>
        <meta name="description" content="Лёгкая версия Медузы" />
        <link rel="icon" href="/favicon.ico" />
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
      </header>

      <main className={styles.main}>{children}</main>

      <footer>
        <p style={{textAlign: 'center'}}>
          Обновление каждые 30 минут
          <br />
          Последнее было:
          <br />
          {time} по мск, {date}
        </p>
        <p>Связаться можно <a href="https://t.me/baradusov">через телеграм</a></p>
      </footer>
    </div>
  );
};

export default Page;
