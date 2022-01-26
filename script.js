
const countdownTime = document.querySelector('#time__passed');
const clockStatus = document.querySelector('#clock__status');
const sessionTime = document.querySelector('#session__settings');
const breakTime = document.querySelector('#break__settings');
const stopSession = document.querySelector('#stop');
const playSession = document.querySelector('#play');
const pauseSession = document.querySelector('#pause');
const restartSession = document.querySelector('#restart');
const sessionTimeDec = document.querySelector('#session__time_minus');
const sessionTimeInc = document.querySelector('#session__time_plus');
const breakTimeDec = document.querySelector('#break__time_minus');
const breakTimeInc = document.querySelector('#break__time_plus');




let TimerState = {
    STOPPED: 0,
    PAUSED: 1,
    PLAY: 2,
};

let PomoState = {
    SESSION: 0,
    BREAK: 1,
};

const secsInAMin = 60;

class PomoClock {
    constructor(display, status, sessionTimeDisplay, breakTimeDisplay, sessionMins, breakMins) {
        this.display = display;
        this.status = status;
        this.sessionTimeDisplay = sessionTimeDisplay;
        this.breakTimeDisplay = breakTimeDisplay;
        this.sessionMins = sessionMins;
        this.breakMins = breakMins;
        this.timer = null;
        this.timeLeft = this.sessionMins * secsInAMin;
        this.timerState = TimerState.STOPPED;
        this.pomoState = PomoState.SESSION;
    }
    

    getDisplayString() {
        let minutes = parseInt(this.timeLeft / secsInAMin, 10);
        let seconds = parseInt(this.timeLeft % secsInAMin, 10);
    
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
    
        return minutes + ":" + seconds;
    }
    
    startClock() {
        if (this.timerState === TimerState.PLAY) {
            return;
        }
        else if (this.timerState === TimerState.STOPPED) {
            if (this.pomoState === PomoState.SESSION) {
                this.timeLeft = this.sessionMins * secsInAMin;
            }
            else {
                this.timeLeft = this.breakMins * secsInAMin;
            }
        }
        
        this.timerState = TimerState.PLAY;
        this.timer = setInterval(() => this.playClock(), 1000);
    }
    
    playClock() {
        if (!(this.timeLeft >= 1)) {
            this.toggleState();
        }

        this.timeLeft--;
        this.display.textContent = this.getDisplayString();
    }

    toggleState() {
        if (this.pomoState === PomoState.SESSION) {
            this.pomoState = PomoState.BREAK;
            this.status.textContent = "Break";
            this.timeLeft = this.breakMins * 60;
        }
        else {
            this.pomoState = PomoState.SESSION;
            this.status.textContent = "Session";
            this.timeLeft = this.sessionMins * 60;
        }
    }
    

    stopClock() {
        this.timerState = TimerState.STOPPED;
        this.resetClock();
        clearInterval(this.timer);
    }

    pauseClock() {
        if (this.timerState === TimerState.PLAY) {
            this.timerState = TimerState.PAUSED;
            clearInterval(this.timer); 
        }
    }

    restartClock() {
        if (this.pomoState === PomoState.SESSION) {
            let minutes = this.sessionMins < 10 ? "0" + this.sessionMins : this.sessionMins;
            this.display.textContent = minutes + ':00';
            this.timeLeft = this.sessionMins * secsInAMin;
        }
        else {
            let minutes = this.breakMins < 10 ? "0" + this.breakMins : this.breakMins;
            this.display.textContent = minutes + ':00';
            this.timeLeft = this.breakMins * secsInAMin;
        }
    }

    resetClock() {
        this.pomoState = PomoState.SESSION;
        this.status.textContent = "Session";
        this.restartClock();
    }

    incSessionMins() {
        this.sessionMins++;
        this.sessionTimeDisplay.textContent = this.sessionMins;
        if (this.timerState === TimerState.STOPPED) {
            this.resetClock();
        }
    }

    decSessionMins() {
        if (this.sessionMins > 1) {
            this.sessionMins--;
            this.sessionTimeDisplay.textContent = this.sessionMins;
            if (this.timerState === TimerState.STOPPED) {
                this.resetClock();
            }
        }
    }

    incBreakMins() {
        this.breakMins++;
        this.breakTimeDisplay.textContent = this.breakMins;        
    }

    decBreakMins() {
        if (this.breakMins > 1) {
            this.breakMins--;
            this.breakTimeDisplay.textContent = this.breakMins;        
        }
    }
}

let pomodoroClock = new PomoClock(countdownTime, clockStatus, sessionTime, breakTime, 25, 5);

playSession.addEventListener('click', start);

function start(e) {
    pomodoroClock.startClock();
}
stopSession.addEventListener('click', stop);

function stop(e) {
    pomodoroClock.stopClock();
}
pauseSession.addEventListener('click', pause);

function pause() {
    pomodoroClock.pauseClock();
}
restartSession.addEventListener('click', restart);

function restart(e) {
    pomodoroClock.restartClock();
}
sessionTimeInc.addEventListener('click', increaseSessionMins);

function increaseSessionMins(e) {
    pomodoroClock.incSessionMins();
}
sessionTimeDec.addEventListener('click', decreaseSessionMins);

function decreaseSessionMins(e) {
    pomodoroClock.decSessionMins();
}
breakTimeInc.addEventListener('click', increaseBreakMins);

function increaseBreakMins(e) {
    pomodoroClock.incBreakMins();
}
breakTimeDec.addEventListener('click', decreaseBreakMins);

function decreaseBreakMins(e) {
    pomodoroClock.decBreakMins();
}

