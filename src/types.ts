export type BaseTimeDatum = Record<'timestamp', Date>
export type TimeDatum<Layer extends string | number> = BaseTimeDatum & Record<Layer, number>
