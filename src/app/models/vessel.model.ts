/**
 * Shape of each item in
 * https://frontendteamfiles.blob.core.windows.net/exercises/vessels.json
 */
export interface Vessel {
  id: number;
  name: string;
  mmsi: number;
  imo: number;
  companyId: number;
  companyName: string;
  /** ISO 8601 instant, e.g. `"1998-01-01T00:00:00Z"` */
  startDate: string;
  active: boolean;
  vesselType: string;
}

export type VesselList = Vessel[];
