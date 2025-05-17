export interface Price {
  id: number;
  dayOfWeek: string;
  timeRangeStart: number;
  timeRangeEnd: number;
  pricePerHour: number;
}
