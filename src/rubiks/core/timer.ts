export class Timer {
    private totalTime: number; // in seconds
    private remainingTime: number;
    private intervalId: number | null = null;
    private isRunning: boolean = false;
    private onTick?: (remainingTime: number) => void;
    private onComplete?: () => void;

    constructor(totalTimeSeconds: number) {
        this.totalTime = totalTimeSeconds;
        this.remainingTime = totalTimeSeconds;
    }

    public start(onTick?: (remainingTime: number) => void, onComplete?: () => void): void {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.onTick = onTick;
        this.onComplete = onComplete;
        
        this.intervalId = window.setInterval(() => {
            this.remainingTime--;
            
            if (this.onTick) {
                this.onTick(this.remainingTime);
            }
            
            if (this.remainingTime <= 0) {
                this.stop();
                if (this.onComplete) {
                    this.onComplete();
                }
            }
        }, 1000);
    }

    public stop(): void {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isRunning = false;
    }

    public reset(): void {
        this.stop();
        this.remainingTime = this.totalTime;
    }

    public getRemainingTime(): number {
        return this.remainingTime;
    }

    public getFormattedTime(): string {
        const minutes = Math.floor(this.remainingTime / 60);
        const seconds = this.remainingTime % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    public isTimerRunning(): boolean {
        return this.isRunning;
    }

    public setTotalTime(seconds: number): void {
        this.totalTime = seconds;
        this.remainingTime = seconds;
    }
}
