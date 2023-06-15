import {
  catchError,
  Observable,
  of,
  switchMap,
  first,
} from 'rxjs';

function createFetchClient<T>(data$: Observable<T>) {
  return data$.pipe(
    switchMap((response) => of(response)),
    first(),
    catchError((err) => {
      throw err;
    }),
  );
}

export {
  createFetchClient,
};
