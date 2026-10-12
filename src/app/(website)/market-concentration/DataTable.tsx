'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import styles from './page.module.css';

export interface Column<T> {
  key: string;
  label: string;
  numeric?: boolean;
  /** Without a sortValue the column is not sortable. */
  sortValue?: (row: T) => number | string | null | undefined;
  render: (row: T, index: number) => ReactNode;
  /** Pins the column while the table scrolls sideways (use on the first column). */
  sticky?: boolean;
  title?: string;
}

export interface SortState {
  key: string;
  dir: 'asc' | 'desc';
}

interface Props<T> {
  rows: T[];
  columns: Column<T>[];
  getKey: (row: T) => string;
  defaultSort: SortState;
  /** Rows revealed each time the user scrolls to the bottom. */
  pageSize?: number;
  emptyText: string;
  /** Singular/plural noun for the "Showing x of y" line. */
  noun?: string;
}

const isBlank = (v: unknown) => v === null || v === undefined || (typeof v === 'number' && Number.isNaN(v));

/**
 * Sortable table with infinite scrolling. Click a header to sort ascending, click again for descending.
 * Rows without a value for the sorted column always stay at the bottom.
 * Render with a `key` that changes when the data set changes so scroll position and sort reset.
 */
export default function DataTable<T>({ rows, columns, getKey, defaultSort, pageSize = 30, emptyText, noun = 'funds' }: Props<T>) {
  const [sort, setSort] = useState<SortState>(defaultSort);
  const [visible, setVisible] = useState(pageSize);
  const boxRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const sorted = useMemo(() => {
    const col = columns.find(c => c.key === sort.key && c.sortValue);
    if (!col?.sortValue) return rows;
    const get = col.sortValue;
    const factor = sort.dir === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const va = get(a);
      const vb = get(b);
      if (isBlank(va) && isBlank(vb)) return 0;
      if (isBlank(va)) return 1;
      if (isBlank(vb)) return -1;
      if (typeof va === 'string' || typeof vb === 'string') return factor * String(va).localeCompare(String(vb), 'en', { sensitivity: 'base' });
      return factor * ((va as number) - (vb as number));
    });
  }, [rows, columns, sort]);

  const shown = sorted.slice(0, visible);
  const hasMore = visible < sorted.length;

  // Infinite scrolling: reveal the next page when the sentinel at the bottom of the box scrolls into view
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;
    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) setVisible(v => v + pageSize); },
      { root: boxRef.current, rootMargin: '0px 0px 240px 0px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, visible, pageSize]);

  const changeSort = (key: string) => {
    setSort(prev => (prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));
    setVisible(pageSize);
    boxRef.current?.scrollTo({ top: 0 });
  };

  return (
    <>
      <div className={styles.scrollBox} ref={boxRef}>
        <table className={styles.denseTable}>
          <thead>
            <tr>
              {columns.map(col => {
                const active = sort.key === col.key;
                const sortable = !!col.sortValue;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    title={col.title}
                    aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : sortable ? 'none' : undefined}
                    className={[styles.denseTh, col.numeric ? styles.numCol : '', col.sticky ? styles.stickyHead : '', active ? styles.thRanked : ''].join(' ')}
                  >
                    {sortable ? (
                      <button type="button" className={styles.sortBtn} onClick={() => changeSort(col.key)}>
                        {col.label}
                        {active
                          ? (sort.dir === 'asc' ? <ArrowUp className={styles.sortIcon} /> : <ArrowDown className={styles.sortIcon} />)
                          : <ArrowUpDown className={`${styles.sortIcon} ${styles.sortIconIdle}`} />}
                      </button>
                    ) : col.label}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {shown.map((row, i) => (
              <tr key={getKey(row)} className={styles.denseTr}>
                {columns.map(col => (
                  <td key={col.key} className={[styles.denseTd, col.numeric ? styles.numCol : '', col.sticky ? styles.stickyCol : ''].join(' ')}>
                    {col.render(row, i)}
                  </td>
                ))}
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr><td className={styles.denseTd} colSpan={columns.length}>{emptyText}</td></tr>
            )}
          </tbody>
        </table>
        {hasMore && <div ref={sentinelRef} className={styles.sentinel}>Loading more…</div>}
      </div>
      {sorted.length > 0 && (
        <div className={styles.statusLine} aria-live="polite">
          Showing {shown.length} of {sorted.length} {noun}{hasMore ? ' — scroll the table for more' : ''}
        </div>
      )}
    </>
  );
}
