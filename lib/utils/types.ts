
export interface GraphTimeSeries {
  id: string | number;
  data: {
    x: number | string | Date
    y: number | string | Date
  }[]
}

export interface TimeSeriesDatum {
  date: number;
  [key: string]: number;
}
