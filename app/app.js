$(document).ready(function () {
    let localStorageData, parsingData;

    localStorageData = localStorage.birthdayDate;
    if (localStorageData) {
        renderAgeLoop();
    } else {
        $('#dob-template').show();
    }

    $('form').on('submit', function (e) {
        e.preventDefault();

        let birthdayDate = $(this).find('#date')[0].valueAsDate;

        if (birthdayDate) {
            localStorage.birthdayDate = birthdayDate.getTime();
            $('#dob-template').hide();
            renderAgeLoop();
        } else {
            return 'incorrect date';
        }
    });

    function renderAgeLoop() {
        localStorageData = localStorage.birthdayDate;
        setInterval(function () {
            parsingData = new Date(parseInt(localStorageData));
            let now = new Date;
            let duration = now - parsingData;
            let years = duration / 31556900000; // 1 year in millisecond

            let majorMinor = years.toFixed(9).toString().split('.');
            $('#year').text(majorMinor[0]);
            $('#milliseconds').text(majorMinor[1]);
        }, 100);
        $('#age-template').show();
    }
    const fullDuration = (start = new Date(), end = new Date()) => {
        let duration = end - start;
        const YEAR = 1000*60*60*24*365;
        const formattedDuration = {
            years: 0,
            months: 0,
            days: 0,
            hours: 0,
            mins: 0,
            secs: 0,
        }

        formattedDuration.years = Math.floor(duration / YEAR)
        duration -= formattedDuration.years * YEAR

        formattedDuration.months = Math.floor(duration / YEAR * 12)
        duration -= formattedDuration.months * (YEAR / 12)

        formattedDuration.days = Math.floor(duration / YEAR * 365) % 30
        duration -= formattedDuration.days * (YEAR / 365);
        
        formattedDuration.hours = Math.floor(duration / (1000 * 60 * 60)) % 24
        duration -= formattedDuration.hours * (1000 * 60 * 60)

        formattedDuration.mins = Math.floor(duration / (1000 * 60)) % 60
        duration -= formattedDuration.mins * (1000 * 60)

        formattedDuration.secs = Math.floor(duration / 1000) % 60
        duration -= formattedDuration.secs * 1000

        return formattedDuration

    }
});