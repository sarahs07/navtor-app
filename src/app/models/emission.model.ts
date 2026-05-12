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
