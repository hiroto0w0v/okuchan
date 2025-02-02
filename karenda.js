function saveSchedule() {
    const schedule = {
        sunday: document.getElementById('sunday').value,
        monday: document.getElementById('monday').value,
        tuesday: document.getElementById('tuesday').value,
        wednesday: document.getElementById('wednesday').value,
        thursday: document.getElementById('thursday').value,
        friday: document.getElementById('friday').value,
        saturday: document.getElementById('saturday').value
    };

    localStorage.setItem('weeklySchedule', JSON.stringify(schedule));

    alert('予定が保存されました！');
}

// 保存された予定を読み込んで表示する
window.onload = function() {
    const savedSchedule = localStorage.getItem('weeklySchedule');
    if (savedSchedule) {
        const schedule = JSON.parse(savedSchedule);
        document.getElementById('sunday').value = schedule.sunday;
        document.getElementById('monday').value = schedule.monday;
        document.getElementById('tuesday').value = schedule.tuesday;
        document.getElementById('wednesday').value = schedule.wednesday;
        document.getElementById('thursday').value = schedule.thursday;
        document.getElementById('friday').value = schedule.friday;
        document.getElementById('saturday').value = schedule.saturday;
    }
};
