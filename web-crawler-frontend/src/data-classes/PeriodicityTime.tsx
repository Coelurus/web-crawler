export default class PeriodicityTime {
  id: number;
  minute: number;
  hour: number;
  day: number;

  public constructor(id: number, minute: number, hour: number, day: number) {
    this.id = id;
    this.minute = minute;
    this.hour = hour;
    this.day = day;
  }
}
