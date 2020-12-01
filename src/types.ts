export type BaseTimeDatum = Record<'timestamp', Date>
export type TimeDatum<Layer extends string> = BaseTimeDatum & Record<Layer, number>
