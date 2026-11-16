import clsx from 'classnames';
import React from 'react';
import { useHistory } from 'react-router-dom';
import styles from './Overview.module.scss';
import { barHeight, priorGhostSpan, positiveShares } from './overviewSeries';

// every chart draws in a 300 x 64 box stretched to the tile width.
const WIDTH = 300;
const HEIGHT = 64;
const BAR_GAP = 5;

interface ChartTipProps {
  /** Position from the inline start (left in LTR, right in RTL), in %. */
  left: number;
  children: React.ReactNode;
}

function ChartTip({ left, children }: ChartTipProps) {
  return (
    <div
      role="tooltip"
      className={styles.tip}
      style={{ insetInlineStart: `${Math.min(92, Math.max(8, left))}%` }}
    >
      {children}
    </div>
  );
}

export interface TipRow {
  label: string;
  value: string;
  /** Muted rows are context: last year, the state of the month. */
  muted?: boolean;
}

/**
 * Two aligned columns: this period at full contrast, last year muted, then
 * an optional muted note (the change, when it is material).
 */
export function TipBody({ rows, note }: { rows: TipRow[]; note?: string }) {
  return (
    <span className={styles.tipBody}>
      {rows.map((row) => (
        <React.Fragment key={row.label}>
          <span className={row.muted ? styles.tipMuted : styles.tipStrong}>
            {row.label}
          </span>
          <span
            className={clsx(styles.tipValue, {
              [styles.tipMuted]: row.muted,
              [styles.tipStrong]: !row.muted,
            })}
          >
            {row.value}
          </span>
        </React.Fragment>
      ))}
      {note && <span className={styles.tipNote}>{note}</span>}
    </span>
  );
}

function useHoverIndex() {
  const [index, setIndex] = React.useState<number | null>(null);
  const bind = (i: number) => ({
    onMouseEnter: () => setIndex(i),
    onMouseLeave: () => setIndex(null),
  });
  return { index, setIndex, bind };
}

interface BarChartProps {
  values: number[];
  prior: number[];
  showPrior: boolean;
  /** Tooltip content per bar. */
  tips: React.ReactNode[];
}

/**
 * Monthly bars: the latest complete month in the accent, the month in
 * progress hatched, earlier months in the history color, and an optional
 * prior-year tick on each bar.
 */
export function BarChart({ values, prior, showPrior, tips }: BarChartProps) {
  const patternId = React.useId().replace(/:/g, '');
  const { index: hovered, bind } = useHoverIndex();
  const count = values.length;
  const barWidth = (WIDTH - BAR_GAP * (count - 1)) / count;
  const peak = Math.max(1, ...values, ...(showPrior ? prior : [])) * 1.06;
  const heightOf = (value: number) => barHeight(value, peak, HEIGHT - 1);

  return (
    <div className={styles.chart}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id={patternId}
            width="4"
            height="4"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line x1="0" y1="0" x2="0" y2="4" className={styles.hatch} />
          </pattern>
        </defs>
        {hovered !== null && (
          // the hovered month as a faint band behind the marks, never over them.
          <rect
            className={styles.hoverBand}
            x={hovered * (barWidth + BAR_GAP) - BAR_GAP / 2}
            y={0}
            width={barWidth + BAR_GAP}
            height={HEIGHT}
          />
        )}
        {values.map((value, i) => {
          const x = i * (barWidth + BAR_GAP);
          const height = heightOf(value);
          const isInProgress = i === count - 1;
          const isLatest = i === count - 2;
          const priorHeight = showPrior ? heightOf(prior[i] ?? 0) : 0;
          const ghost = priorGhostSpan(x, barWidth, BAR_GAP);
          return (
            <g key={i}>
              {priorHeight > 0 && (
                // last year as a faint filled bar behind this year's, a touch
                // wider so it still shows beside a taller current bar.
                <rect
                  className={styles.priorGhost}
                  x={ghost.x}
                  y={HEIGHT - 1 - priorHeight}
                  width={ghost.width}
                  height={priorHeight}
                  rx={2}
                />
              )}
              {height > 0 && (
                <rect
                  className={clsx(styles.bar, {
                    [styles.barLatest]: isLatest,
                  })}
                  x={x}
                  y={HEIGHT - 1 - height}
                  width={barWidth}
                  height={height}
                  rx={2}
                  style={
                    {
                      '--i': i,
                      ...(isInProgress ? { fill: `url(#${patternId})` } : {}),
                    } as React.CSSProperties
                  }
                />
              )}
              <rect
                className={styles.hit}
                x={x - BAR_GAP / 2}
                y={0}
                width={barWidth + BAR_GAP}
                height={HEIGHT}
                {...bind(i)}
              />
            </g>
          );
        })}
        <line
          className={styles.baseline}
          x1={0}
          x2={WIDTH}
          y1={HEIGHT - 0.5}
          y2={HEIGHT - 0.5}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {hovered !== null && (
        <ChartTip left={((hovered + 0.5) / count) * 100}>
          {tips[hovered]}
        </ChartTip>
      )}
    </div>
  );
}

/** Where a month's bars lead, and what to call that for assistive tech. */
export interface MonthTarget {
  to: string;
  label: string;
}

interface PairedBarChartProps {
  /** The first series of each pair (revenue, money in). */
  first: number[];
  /** The second series of each pair (spend, money out). */
  second: number[];
  /** Short month names under the pairs, in time order. */
  labels: string[];
  tips: React.ReactNode[];
  /** Makes each month a link of its own, over the tile's link. */
  targets?: MonthTarget[];
}

/**
 * Two bars per month, side by side: the first in the history color, the
 * second in its companion color. The month in progress is hatched in both
 * so a partial month never reads as a bad one.
 */
export function PairedBarChart({
  first,
  second,
  labels,
  tips,
  targets,
}: PairedBarChartProps) {
  const id = React.useId().replace(/:/g, '');
  const history = useHistory();
  const { index: hovered, setIndex: setHovered, bind } = useHoverIndex();
  const count = first.length;
  const slot = WIDTH / count;
  const barWidth = Math.max(2, (slot - BAR_GAP) / 2 - 0.5);
  const peak = Math.max(1, ...first, ...second) * 1.06;
  const heightOf = (value: number) => barHeight(value, peak, HEIGHT - 1);

  // the tile around the chart is a link too, so the month's own click must
  // not also trigger it: that would open the 12-month report instead.
  const open = (event: React.SyntheticEvent, to: string) => {
    event.preventDefault();
    event.stopPropagation();
    history.push(to);
  };
  const monthLinkProps = (i: number, { to, label }: MonthTarget) => ({
    role: 'link',
    tabIndex: 0,
    'aria-label': label,
    onClick: (event: React.MouseEvent) => open(event, to),
    onKeyDown: (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') open(event, to);
    },
    // keyboard focus shows the same tooltip the pointer does.
    onFocus: () => setHovered(i),
    onBlur: () => setHovered(null),
  });

  const bar = (value: number, x: number, i: number, isSecond: boolean) => {
    const height = heightOf(value);
    if (height <= 0) return null;
    const isInProgress = i === count - 1;
    return (
      <rect
        className={clsx(styles.bar, { [styles.barCompanion]: isSecond })}
        x={x}
        y={HEIGHT - 1 - height}
        width={barWidth}
        height={height}
        rx={1.5}
        style={
          {
            '--i': i,
            ...(isInProgress
              ? { fill: `url(#${id}${isSecond ? 'b' : 'a'})` }
              : {}),
          } as React.CSSProperties
        }
      />
    );
  };

  return (
    <div className={styles.chart}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        // focusable month targets must stay in the accessibility tree.
        aria-hidden={targets ? undefined : 'true'}
      >
        <defs>
          {(['a', 'b'] as const).map((key) => (
            <pattern
              key={key}
              id={`${id}${key}`}
              width="4"
              height="4"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="4"
                className={
                  key === 'a' ? styles.hatchHistory : styles.hatchCompanion
                }
              />
            </pattern>
          ))}
        </defs>
        {hovered !== null && (
          <rect
            className={styles.hoverBand}
            x={hovered * slot}
            y={0}
            width={slot}
            height={HEIGHT}
          />
        )}
        {first.map((value, i) => {
          const x = i * slot + BAR_GAP / 2;
          return (
            <g key={i}>
              {bar(value, x, i, false)}
              {bar(second[i] ?? 0, x + barWidth + 1, i, true)}
              <rect
                className={clsx(styles.hit, {
                  [styles.hitLink]: targets?.[i],
                })}
                x={i * slot}
                y={0}
                width={slot}
                height={HEIGHT}
                {...bind(i)}
                {...(targets?.[i] ? monthLinkProps(i, targets[i]) : {})}
              />
            </g>
          );
        })}
        <line
          className={styles.baseline}
          x1={0}
          x2={WIDTH}
          y1={HEIGHT - 0.5}
          y2={HEIGHT - 0.5}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {/* text stays out of the svg so it is never mirrored in RTL. */}
      <div className={styles.monthLabels} aria-hidden="true">
        {labels.map((label, i) => (
          <span key={i}>{label}</span>
        ))}
      </div>
      {hovered !== null && (
        <ChartTip left={((hovered + 0.5) / count) * 100}>
          {tips[hovered]}
        </ChartTip>
      )}
    </div>
  );
}

interface LineChartProps {
  values: number[];
  prior: number[];
  showPrior: boolean;
  tips: React.ReactNode[];
}

/** A running line with a soft area, an end dot and an optional dashed prior. */
export function LineChart({ values, prior, showPrior, tips }: LineChartProps) {
  const gradientId = React.useId().replace(/:/g, '');
  const { index: hovered, bind } = useHoverIndex();
  const count = values.length;
  const all = values.concat(showPrior ? prior : []);
  // zero stays in range so a loss reads as below the line, not as a dip.
  const low = Math.min(0, ...all);
  const high = Math.max(0, ...all);
  const span = high - low || 1;
  const step = count > 1 ? WIDTH / (count - 1) : WIDTH;

  const pointOf = (value: number, i: number): [number, number] => [
    count > 1 ? i * step : WIDTH / 2,
    3 + (1 - (value - low) / span) * (HEIGHT - 6),
  ];
  const pathOf = (series: number[]) =>
    series
      .map((value, i) => `${i ? 'L' : 'M'}${pointOf(value, i).join(',')}`)
      .join('');
  const line = pathOf(values);
  const end = pointOf(values[count - 1] ?? 0, count - 1);

  return (
    <div className={styles.chart}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" className={styles.areaStart} />
            <stop offset="1" className={styles.areaEnd} />
          </linearGradient>
        </defs>
        {hovered !== null && (
          <rect
            className={styles.hoverBand}
            x={Math.max(0, hovered * step - step / 2)}
            y={0}
            width={step}
            height={HEIGHT}
          />
        )}
        {showPrior && (
          <path
            className={styles.priorLine}
            d={pathOf(prior.slice(0, count))}
            vectorEffect="non-scaling-stroke"
          />
        )}
        <path
          className={styles.area}
          d={`${line}L${end[0]},${HEIGHT}L0,${HEIGHT}Z`}
          fill={`url(#${gradientId})`}
        />
        <path
          className={styles.line}
          d={line}
          pathLength={1}
          vectorEffect="non-scaling-stroke"
        />
        {values.map((_, i) => (
          <rect
            key={i}
            className={styles.hit}
            x={Math.max(0, i * step - step / 2)}
            y={0}
            width={step}
            height={HEIGHT}
            {...bind(i)}
          />
        ))}
        <line
          className={styles.baseline}
          x1={0}
          x2={WIDTH}
          y1={HEIGHT - 0.5}
          y2={HEIGHT - 0.5}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <i
        className={styles.lineEnd}
        style={{
          insetInlineStart: `${(end[0] / WIDTH) * 100}%`,
          top: end[1] - 4,
        }}
      />
      {hovered !== null && (
        <ChartTip left={count > 1 ? (hovered / (count - 1)) * 100 : 50}>
          {tips[hovered]}
        </ChartTip>
      )}
    </div>
  );
}

export interface AgeSegment {
  key: string;
  label: React.ReactNode;
  value: number;
  display: string;
  tone: 'history' | 'risk' | 'risk-hatched';
}

/** A proportional bar of amounts by age, with a labeled value under each. */
export function AgeBar({ segments }: { segments: AgeSegment[] }) {
  const { index: hovered, bind } = useHoverIndex();
  const shares = positiveShares(segments.map((s) => s.value));
  // tooltip anchor: the middle of each segment, as a share of the width.
  const centers = shares.map((share, i) => sumBefore(shares, i) + share / 2);

  return (
    <div className={styles.chart}>
      <div className={styles.age}>
        {/* zero buckets are left out entirely: no slivers, no extra gaps. */}
        {segments.map((segment, i) =>
          shares[i] > 0 ? (
            <i
              key={segment.key}
              className={clsx(
                styles.ageSegment,
                styles[`tone-${segment.tone}`],
              )}
              style={{ flexGrow: shares[i] }}
              {...bind(i)}
            />
          ) : null,
        )}
      </div>
      <div className={styles.ageLabels}>
        {segments.map((segment) => (
          <span
            key={segment.key}
            className={clsx({
              [styles.ageRisk]: segment.tone !== 'history' && segment.value > 0,
              // empty buckets recede so the one holding money stands out.
              [styles.ageZero]: Math.round(segment.value) === 0,
            })}
          >
            <b>{segment.display}</b>
            {segment.label}
          </span>
        ))}
      </div>
      {hovered !== null && (
        <ChartTip left={centers[hovered] * 100}>
          <b>{segments[hovered].label}</b> {segments[hovered].display}
        </ChartTip>
      )}
    </div>
  );
}

const sumBefore = (values: number[], index: number): number =>
  values.slice(0, index).reduce((sum, value) => sum + value, 0);

export interface RankRow {
  key: string;
  label: string;
  value: number;
  display: string;
}

/** Ranked horizontal bars scaled to the largest row. */
interface RankBarsProps {
  rows: RankRow[];
  /** Muted footer, e.g. "+2 more", for rows that did not fit. */
  more?: React.ReactNode;
}

export function RankBars({ rows, more }: RankBarsProps) {
  const peak = Math.max(1, ...rows.map((row) => Math.abs(row.value)));
  return (
    <div className={clsx(styles.chart, styles.rank)}>
      {rows.map((row) => (
        <div key={row.key} className={styles.rankRow} title={row.label}>
          {/* names keep their own direction, so RTL truncates at the end. */}
          <span className={styles.rankLabel} dir="auto">
            {row.label}
          </span>
          <span className={styles.rankTrack}>
            <i style={{ width: `${(Math.abs(row.value) / peak) * 100}%` }} />
          </span>
          <span className={styles.rankValue}>{row.display}</span>
        </div>
      ))}
      {more && <div className={styles.rankMore}>{more}</div>}
    </div>
  );
}
