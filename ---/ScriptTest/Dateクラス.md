```js
function formatDateWithDay(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // 月は0始まり
    const dd = String(date.getDate()).padStart(2, '0');

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const day = days[date.getDay()]; // 曜日番号から文字列に変換

    return `${yyyy}-${mm}-${dd}_${day}`;
}

const date = new Date('2025-04-09T08:35:40');

// 使い方：
const now = new Date();
console.log(formatDateWithDay(now)); // 例: 2025-04-18_Fri
console.log(formatDateWithDay(date)); 
```
