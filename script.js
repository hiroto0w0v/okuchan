document.addEventListener('DOMContentLoaded', () => {
    const monthYearElement = document.getElementById('month-year');
    const calendarDaysElement = document.getElementById('calendar-days');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');
    const eventModal = document.getElementById('event-modal');
    const saveEventButton = document.getElementById('save-event');
    const closeModalButton = document.getElementById('close-modal');
    const eventTitleInput = document.getElementById('event-title');

    let currentDate = new Date();
    let selectedDate = null;
    let events = loadEvents();  // ページがロードされた時にローカルストレージから予定を読み込む

    // ローカルストレージから予定を読み込む関数
    function loadEvents() {
        const savedEvents = localStorage.getItem('events');
        return savedEvents ? JSON.parse(savedEvents) : {};  // 保存されていればそのデータを使い、なければ空のオブジェクト
    }

    // 予定をローカルストレージに保存する関数
    function saveEventsToStorage() {
        localStorage.setItem('events', JSON.stringify(events));  // `events`をJSONとして保存
    }

    // カレンダーを描画する関数
    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        monthYearElement.textContent = `${year}年 ${month + 1}月`;

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const firstDayOfWeek = firstDayOfMonth.getDay();
        const totalDays = lastDayOfMonth.getDate();

        calendarDaysElement.innerHTML = ''; // カレンダーの内容をリセット

        // 空白のセルを挿入
        for (let i = 0; i < firstDayOfWeek; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('empty');
            calendarDaysElement.appendChild(emptyCell);
        }

        // 今日の日付を追跡して、カレンダーに表示
        const today = new Date();
        const todayYear = today.getFullYear();
        const todayMonth = today.getMonth();
        const todayDay = today.getDate();

        // 日付を挿入
        for (let day = 1; day <= totalDays; day++) {
            const dayCell = document.createElement('div');
            dayCell.textContent = day;

            // 火曜日と金曜日に「空手」と表示
            const date = new Date(year, month, day);
            const dayOfWeek = date.getDay(); // 0:日曜, 1:月曜, 2:火曜, 3:水曜, 4:木曜, 5:金曜, 6:土曜
            if (dayOfWeek === 2 || dayOfWeek === 5) { // 火曜日(2)と金曜日(5)
                dayCell.classList.add('karate-day');
                dayCell.setAttribute('title', '空手');
            }

            // 保存された予定があれば表示
            const eventKey = `${year}-${month + 1}-${day}`;
            if (events[eventKey]) {
                const eventText = events[eventKey];
                const eventLabel = document.createElement('div');
                eventLabel.textContent = eventText;
                eventLabel.classList.add('event-label');
                dayCell.appendChild(eventLabel);

                // 削除ボタンを作成
                const deleteButton = document.createElement('button');
                deleteButton.textContent = '削除';
                deleteButton.classList.add('delete-button');
                deleteButton.addEventListener('click', (e) => {
                    e.stopPropagation();  // クリックイベントが親要素に伝播しないようにする
                    deleteEvent(eventKey, dayCell);
                });
                dayCell.appendChild(deleteButton);
            }

            // 今日の日付にクラスを付ける (現在の月にだけ「今日」を表示)
            if (day === todayDay && month === todayMonth && year === todayYear) {
                dayCell.classList.add('today');
            }

            dayCell.addEventListener('click', () => selectDate(day));
            calendarDaysElement.appendChild(dayCell);
        }
    };

    // 日付が選択された時にモーダルを表示
    const selectDate = (day) => {
        selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        eventModal.style.display = 'flex';
    };

    // 予定を保存する
    const saveEvent = () => {
        const eventTitle = eventTitleInput.value.trim();
        if (eventTitle && selectedDate) {
            const eventKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;
            events[eventKey] = eventTitle;  // 予定を保存
            saveEventsToStorage();  // ローカルストレージに保存
            renderCalendar();  // カレンダーを再描画して予定を反映
            eventModal.style.display = 'none';
        }
    };

    // 予定を削除する
    const deleteEvent = (eventKey, dayCell) => {
        if (confirm('この予定を削除しますか？')) {
            delete events[eventKey];  // eventsから予定を削除
            saveEventsToStorage();  // ローカルストレージからも削除
            renderCalendar();  // カレンダーを再描画
        }
    };

    // モーダルを閉じる
    const closeModal = () => {
        eventModal.style.display = 'none';
    };

    prevMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    saveEventButton.addEventListener('click', saveEvent);
    closeModalButton.addEventListener('click', closeModal);

    renderCalendar();
});
