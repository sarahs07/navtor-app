/**
 * One interval in `timeSeries` from
 * https://frontendteamfiles.blob.core.windows.net/exercises/emissions.json
 */
export interface EmissionTimeSeriesPoint {
  /** ISO 8601 instant */
  report_from_utc: string;
  /** ISO 8601 instant */
  report_to_utc: string;
  co2_emissions: number;
  sox_emissions: number;
  nox_emissions: number;
  pm_emissions: number;
  ch4_emissions: number;
}

/**
 * One vessel (or entity) emissions record: id + series of reporting intervals.
 */
export interface EmissionRecord {
  id: number;
  timeSeries: EmissionTimeSeriesPoint[];
}

export type EmissionsList = EmissionRecord[];

/** Numeric emission fields on each time-series point (from the API). */
export type EmissionMetricKey =
  | 'co2_emissions'
  | 'sox_emissions'
  | 'nox_emissions'
  | 'pm_emissions'
  | 'ch4_emissions';

export const EMISSION_METRIC_OPTIONS: ReadonlyArray<{
  key: EmissionMetricKey;
  label: string;
}> = [
  { key: 'co2_emissions', label: 'CO₂' },
  { key: 'sox_emissions', label: 'SOx' },
  { key: 'nox_emissions', label: 'NOx' },
  { key: 'pm_emissions', label: 'Particulate matter (PM)' },
  { key: 'ch4_emissions', label: 'CH₄' },
];

/** Options that exist on the loaded payload (handles API shape drift). */
export function emissionMetricOptionsForRecords(
  records: EmissionsList,
): ReadonlyArray<{ key: EmissionMetricKey; label: string }> {
  const sample = records[0]?.timeSeries[0];
  if (!sample) return EMISSION_METRIC_OPTIONS;
  return EMISSION_METRIC_OPTIONS.filter((o) => o.key in sample);
}
