import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const refs = {
    calendar: document.querySelector('#datetime-picker'),
    start: document.querySelector('button[data-start]'),
    days: document.querySelector('span[data-days]'),
    hours: document.querySelector('span[data-hours]'),
    minutes: document.querySelector('span[data-minutes]'),
    seconds: document.querySelector('span[data-seconds]'),
};

let timer = null;
let userSelectedDate = null;

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        const selectedDate = selectedDates[0];
        if (selectedDate <= new Date()) {
            iziToast.warning({
                message: 'Please choose a date in the future',
                position: "topRight",
                closeOnClick: true,
                closeOnEscape: true,
                backgroundColor: 'red',
                titleSize: '20',
                messageSize: '14'
            });
            refs.start.setAttribute('disabled', true);
        } else {
            userSelectedDate = selectedDate;
            refs.start.removeAttribute('disabled');
        }
    },
};

flatpickr(refs.calendar, options);
refs.start.setAttribute('disabled', true);

function addLeadingZero(value) {
    return String(value).padStart(2, '0');
}

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = addLeadingZero(Math.floor(ms / day));
    const hours = addLeadingZero(Math.floor((ms % day) / hour));
    const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
    const seconds = addLeadingZero(Math.floor((((ms % day) % hour) % minute) / second));

    return { days, hours, minutes, seconds };
}

function enableStartAndCalendar() {
    refs.start.removeAttribute('disabled');
    refs.calendar.removeAttribute('disabled');
}

function onButtonClick() {
    if (userSelectedDate === null) {
        return;
    }

    timer = setInterval(() => {
        const difference = userSelectedDate - Date.now();
        if (difference <= 0) {
            clearInterval(timer);
            enableStartAndCalendar();
            iziToast.success({
                message: 'Countdown finished!',
                position: "topRight",
                closeOnClick: true,
                closeOnEscape: true,
                backgroundColor: 'green',
                titleSize: '20',
                messageSize: '14'
            });
            return;
        }

        const timeData = convertMs(difference);
        updateTimer(timeData);
    }, 1000);

    refs.start.setAttribute('disabled', true);
    refs.calendar.setAttribute('disabled', true);
}

function updateTimer({ days, hours, minutes, seconds }) {
    refs.days.textContent = days;
    refs.hours.textContent = hours;
    refs.minutes.textContent = minutes;
    refs.seconds.textContent = seconds;
}

refs.start.addEventListener('click', onButtonClick);