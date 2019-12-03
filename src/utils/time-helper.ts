export class TimeHelper {
    private constructor() {
    }

    static getTimestamp(date: string): number {
        let time: Date = new Date(date);
        if (isNaN(time.getTime())) {
            time = new Date(date.replace(
                /^(\d{4})(\d\d)(\d\d) (\d\d):(\d\d)$/,
                '$4:$5:00 $2/$3/$1'
            ));
        }
        return time.getTime();
    }
}