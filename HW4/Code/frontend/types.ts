export interface Player {
  id: number;
  name: string;
  nation: string;
  club: string;
  position: string;
  overall: number;
  pace: number;
}

export interface SearchResponse {
  results: Player[];
  execution_time: number; // in seconds
  count: number;
}

export interface ApiError {
  message: string;
}

export type PaneTheme = 'red' | 'green';
export type EndpointType = 'no_index' | 'with_index';
