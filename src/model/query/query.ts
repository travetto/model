import { _WhereClause } from './where';
import { RetainFields } from './common';

type _SelectClause<T> = {
  [P in keyof T]?:
  T[P] extends object ? _SelectClause<RetainFields<T[P]>> : (1 | 0 | boolean);
};

type _GroupClause<T> = {
  [P in keyof T]?: T[P] extends object ? _GroupClause<RetainFields<T[P]>> : (1 | 0 | boolean);
};

type _SortClause<T> = {
  [P in keyof T]?:
  T[P] extends object ? _SortClause<RetainFields<T[P]>> : (1 | -1 | boolean);
};

type _QueryOptions<T> = {
  sort?: _SortClause<T>[];
  limit?: number;
  offset?: number;
};

type _QueryMain<T> = {
  select?: _SelectClause<T>;
  where?: _WhereClause<T>;
  // TODO: Add grouping in later
  // group?: _GroupClause<T>;
};

type _Query<T> = _QueryMain<T> & _QueryOptions<T>;
type _ModelQuery<T> = { where?: _WhereClause<T> };
type _PageableModelQuery<T> = _ModelQuery<T> & _QueryOptions<T>;

export type Query<T> = _Query<RetainFields<T>>;
export type PageableModelQuery<T> = _PageableModelQuery<RetainFields<T>>;
export type QueryOptions<T> = _QueryOptions<RetainFields<T>>;
export type SelectClause<T> = _SelectClause<RetainFields<T>>;
export type SortClause<T> = _SortClause<RetainFields<T>>;
export type GroupClause<T> = _GroupClause<RetainFields<T>>;
export type ModelQuery<T> = _ModelQuery<RetainFields<T>>;