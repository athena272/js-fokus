import { SELECTORS, qs } from "./dom.js";
import { playSoundEffects } from "./sound-effects.js";

// const DEFAULT_DURATIONS = {
//     focus: 5,
//     "short-break": 3,
//     "long-break": 2,
// };

const DEFAULT_DURATIONS = {
    focus: 25 * 60,
    "short-break": 5 * 60,
    "long-break": 15 * 60,
};

function formatTime(totalSeconds)
{
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function createTimer({ onFinish } = {})
{
    const timerEl = qs(SELECTORS.timer);

    let secondsLeft = DEFAULT_DURATIONS.focus;
    let intervalId = null;
    let currentMode = 'focus';

    function isRunning()
    {
        return Boolean(intervalId);
    }

    function render() 
    {
        timerEl.textContent = formatTime(secondsLeft);
    }

    function tick()
    {
        if (secondsLeft <= 0)
        {
            playSoundEffects('beep');
            pause();

            if(currentMode === 'focus')
            {
                document.dispatchEvent(new CustomEvent('FocoFinalizado'));
            }

            onFinish?.();
            return;
        }

        secondsLeft -= 1;
        render();
    }

    function start()
    {
        if (isRunning()) return;
        playSoundEffects('play');
        intervalId = setInterval(tick, 1 * 1000);
    }

    function pause()
    {
        if (!isRunning()) return;
        playSoundEffects('pause');
        clearInterval(intervalId);
        intervalId = null;
    }

    function toggle()
    {
        if (isRunning()) pause();
        else start();
    }

    function setMode(mode)
    {
        currentMode = mode;
        // quando troca o contexto, reseta o tempo do modo e pausa
        pause();
        secondsLeft = DEFAULT_DURATIONS[mode] ?? DEFAULT_DURATIONS.focus;
        render();
    }

    // Init UI
    render();

    return {
        start,
        pause,
        toggle,
        setMode,
        isRunning
    };
}