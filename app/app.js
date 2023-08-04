$(document).ready(function () {
    let localStorageData, bd;

    // show / hide settings
    let settingsShown = false
    $('#options-container').hide()
    $('#settings-icon').on("click", () => {
        if (settingsShown)
            $('#options-container').hide()
        else $('#options-container').show()
        
        settingsShown = !settingsShown
    })
    
    // settings values and associated functions
    const settings = {
        bd: { // TODO: store birthdate here
            value: null,
            apply: null
        },
        showQuote: {
            value: true,
            apply: () => {
                settings.showQuote.value = settings.showQuote.value === 'true'
                if (settings.showQuote.value) {
                    $('#quote').show();
                    $('#show-quote').prop('checked').value = true
                }
                else {
                    $('#quote').hide();
                }
            },
            // get value from user
            get: () => settings.showQuote.value = $('#show-quote').prop('checked')
        },
    }

    const setSettings = () => {
        Object.keys(settings).forEach(key => {
          if (settings[key].get) settings[key].value = (settings[key].get)()
          localStorage.setItem(key, settings[key].value)
          if (settings[key].apply) (settings[key].apply)()
        })
    }

    const retrieveSettings = () => {
        // get settings from local storage, or use default settings if none found
        Object.keys(localStorage).forEach(key => {
            if (settings[key] && localStorage.getItem(key)) {
                settings[key].value = localStorage.getItem(key)
                if (settings[key].apply) (settings[key].apply)()
            }
        })
    }
    // retrieve settings on app start
    retrieveSettings()

    // set settings on clicking 'save' button
    $('#options-container').on('submit', (e) => {
      e.preventDefault()
      setSettings()
      retrieveSettings()
    })

    localStorageData = localStorage.birthdayDate;
    if (localStorageData) {
        renderAgeLoop();
    } else {
        $('#dob-template').show();
    }

    $('#dob-template form').on('submit', function (e) {
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
            bd = new Date(parseInt(localStorageData)); // birtdate
            let now = new Date;
            const timePassed = fullDuration(bd, now)

            Object.keys(timePassed).forEach(unit => {
                $(`#${unit}`).text(String(timePassed[unit]).padStart(2, '0'))
            })

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
            ms: 0,
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

        formattedDuration.ms = duration

        return formattedDuration

    }
});