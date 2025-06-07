document.addEventListener('DOMContentLoaded', function() {
    const calendarButton = document.getElementById('calendarButton');
    const calendarDropdown = document.getElementById('calendarDropdown');
    const monthSelect = document.getElementById('monthSelect');
    const yearSelect = document.getElementById('yearSelect');
    const calendar = document.getElementById('calendar');
    const entryModal = document.getElementById('entryModal');
    const entryDate = document.getElementById('entryDate');
    const entryText = document.getElementById('entryText');
    const closeBtn = document.getElementsByClassName('close')[0];

    // Populate month and year dropdowns
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    for (let i = 0; i < months.length; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.text = months[i];
        monthSelect.appendChild(option);
    }

    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.text = i;
        yearSelect.appendChild(option);
    }

    monthSelect.value = new Date().getMonth();
    yearSelect.value = currentYear;

    // Display calendar dropdown
    calendarButton.addEventListener('click', function() {
        calendarDropdown.style.display = calendarDropdown.style.display === 'block' ? 'none' : 'block';
        generateCalendar();
    });

    monthSelect.addEventListener('change', generateCalendar);
    yearSelect.addEventListener('change', generateCalendar);

    function generateCalendar() {
        calendar.innerHTML = '';
        const month = parseInt(monthSelect.value);
        const year = parseInt(yearSelect.value);

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Fetch entries from local storage
        const entries = getEntries(month + 1, year);

        // Fill initial empty cells
        for (let i = 0; i < firstDay; i++) {
            const day = document.createElement('div');
            day.classList.add('day');
            calendar.appendChild(day);
        }

        // Fill days
        for (let i = 1; i <= daysInMonth; i++) {
            const day = document.createElement('div');
            day.classList.add('day');
            day.textContent = i;

            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const dayName = new Date(dateStr).toLocaleString('en-us', { weekday: 'short' });

            const dayNameSpan = document.createElement('span');
            dayNameSpan.textContent = dayName.substring(0, 3);
            day.appendChild(dayNameSpan);

            if (entries[dateStr]) {
                day.classList.add('highlighted');
            }

            day.addEventListener('click', () => {
                entryDate.value = dateStr;
                entryText.value = entries[dateStr] || '';
                entryModal.style.display = 'block';
            });
            calendar.appendChild(day);
        }
    }

    function getEntries(month, year) {
        const entries = JSON.parse(localStorage.getItem('calendarEntries')) || {};
        const monthYearKey = `${year}-${String(month).padStart(2, '0')}`;
        return entries[monthYearKey] || {};
    }

    function saveEntries(entries) {
        localStorage.setItem('calendarEntries', JSON.stringify(entries));
    }

    // Close modal
    closeBtn.onclick = function() {
        entryModal.style.display = 'none';
    }

    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target == entryModal) {
            entryModal.style.display = 'none';
        }
    }
});

function saveEntry() {
    const entryDate = document.getElementById('entryDate').value;
    const entryText = document.getElementById('entryText').value;

    const dateParts = entryDate.split('-');
    const year = dateParts[0];
    const month = dateParts[1];

    const entries = JSON.parse(localStorage.getItem('calendarEntries')) || {};
    const monthYearKey = `${year}-${month}`;
    
    if (!entries[monthYearKey]) {
        entries[monthYearKey] = {};
    }

    entries[monthYearKey][entryDate] = entryText;
    localStorage.setItem('calendarEntries', JSON.stringify(entries));

    // Highlight the day with an entry
    const dayElements = document.querySelectorAll('.day');
    dayElements.forEach(day => {
        if (day.textContent == entryDate.split('-')[2] &&
            parseInt(monthSelect.value) + 1 == parseInt(entryDate.split('-')[1]) &&
            yearSelect.value == entryDate.split('-')[0]) {
            day.classList.add('highlighted');
        }
    });

    document.getElementById('entryModal').style.display = 'none';
    window.location.href="./Home_Page.html";
}