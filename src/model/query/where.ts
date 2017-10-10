type FieldComparableType = Date | number;
type FieldType = FieldComparableType | string | boolean;
type FieldArrayType = FieldType[];

type Point = [number, number];

type GeneralFieldQuery =
  { $eq: FieldType; } |
  { $ne: FieldType; } |
  { $in: FieldArrayType; } |
  { $nin: FieldArrayType; } |
  { $exists: boolean; };

type ComparableFieldQuery =
  { $lt: FieldComparableType; } |
  { $lte: FieldComparableType; } |
  { $gt: FieldComparableType; } |
  { $gte: FieldComparableType; };

type ArrayFieldQuery =
  { $all: FieldArrayType; };

type StringFieldQuery =
  { $regex: RegExp; };

type GeoFieldQuery =
  { $geoWithin: Point[]; } |
  { $geoIntersects: Point[] };

type FieldQuery = GeneralFieldQuery | ComparableFieldQuery | ArrayFieldQuery | StringFieldQuery | GeoFieldQuery;

// Recursive breaks tsc
type MatchQuery<T> = {
  [P in keyof T]?: FieldQuery | T[P] | {
    [Q in keyof T[P]]?: FieldQuery | T[P][Q] | {
      [R in keyof T[P][Q]]?: FieldQuery | T[P][Q][R] | {
        [S in keyof T[P][Q][R]]?: FieldQuery | T[P][Q][R][S]
      }
    }
  }
};

type Grouping<T> =
  { $and: (Grouping<T> | MatchQuery<T>)[]; } |
  { $or: (Grouping<T> | MatchQuery<T>)[]; } |
  { $not: (Grouping<T> | MatchQuery<T>); };

export type WhereClause<T> = Grouping<T> | MatchQuery<T>;

export function isGrouping<T>(o: WhereClause<T>): o is Grouping<T> {
  return '$and' in o || '$or' in o || '$not' in o;
}

export function isFieldType(o: any): o is FieldType {
  let type = typeof o;
  return o === 'number' || o === 'string' || o === 'boolean' || o instanceof Date;
}