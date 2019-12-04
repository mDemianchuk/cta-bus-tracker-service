export class TimeHelper {
    private constructor() {
    }

    static getTimestamp(date: string): number {
        const dateString = date.replace(/^(\d{4})(\d\d)(\d\d) (\d\d):(\d\d)$/, '$4:$5:00 $2/$3/$1');
        return new Date(dateString).getTime();
    }
}