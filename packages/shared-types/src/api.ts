/** Shape of the public health response. Contains no secrets and no internal topology. */
export interface HealthResponse {
  readonly status: 'ok';
  readonly service: string;
  readonly version: string;
  readonly timestamp: string;
}

/** Standard error envelope used across the API (PLANNING.md section 9). */
export interface ApiErrorBody {
  readonly error: {
    readonly code: string;
    readonly message: string;
    readonly requestId?: string;
  };
}
