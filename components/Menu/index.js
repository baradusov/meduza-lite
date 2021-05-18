import { useRouter } from 'next/router';
import styles from './index.module.css';

const Menu = (props) => {
  const { items, titles } = props;
  const { asPath } = useRouter();

  return (
    <ul className={styles.list}>
      {items.map((slug) => {
        const classes = asPath === `/${slug}` ? styles.active : '';

        return (
          <li key={slug} className={styles.item}>
            <a className={classes} href={`/${slug}`}>
              {titles[slug]}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default Menu;
