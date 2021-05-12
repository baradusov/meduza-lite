import styles from './index.module.css';

const Table = (props) => {
  const { data } = props;
  const { table_credit, rows } = data;

  return (
    <div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <tbody>
            {rows.map(({ key, cells }) => {
              return (
                <tr key={key} className={styles.row}>
                  {cells.map((cell) => {
                    return (
                      <td
                        key={cell.key}
                        dangerouslySetInnerHTML={{ __html: cell.val }}
                      />
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p dangerouslySetInnerHTML={{ __html: table_credit }} />
    </div>
  );
};

export default Table;
