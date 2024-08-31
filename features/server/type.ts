/**
 * return service, repository type
 */
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T
export type UnwrapObject<T extends Record<string, any>> = {
  [K in keyof T]: UnwrapPromise<ReturnType<T[K]>>
}
