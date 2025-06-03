// Firebase SDK import
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyBa1j3Kv2J8pkS8-EuIRLUP65BS4YXcFPY",
  authDomain: "fish-tank-92bf4.firebaseapp.com",
  databaseURL: "https://fish-tank-92bf4-default-rtdb.firebaseio.com",
  projectId: "fish-tank-92bf4",
  storageBucket: "fish-tank-92bf4.appspot.com",
  messagingSenderId: "411742072049",
  appId: "1:411742072049:web:a04c0f3a4ed75cb3cb0d50"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const dataRef = ref(database, 'sensor_data/sensor/data');

// Chart.js - R 그래프
const rChart = new Chart(document.getElementById('R').getContext('2d'), {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'R 값',
      data: [],
      borderWidth: 2,
      borderColor: 'rgba(255, 99, 132, 1)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      tension: 0.3,
      fill: true
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: { title: { display: true, text: '시간' } },
      y: { beginAtZero: true, title: { display: true, text: 'R 값' } }
    }
  }
});

// Chart.js - S 그래프
const sChart = new Chart(document.getElementById('S').getContext('2d'), {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'S 값',
      data: [],
      borderWidth: 2,
      borderColor: 'rgba(54, 162, 235, 1)',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      tension: 0.3,
      fill: true
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: { title: { display: true, text: '시간' } },
      y: { beginAtZero: true, title: { display: true, text: 'S 값' } }
    }
  }
});

// Chart.js - T 그래프
const tChart = new Chart(document.getElementById('T').getContext('2d'), {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'T 값',
      data: [],
      borderWidth: 2,
      borderColor: 'rgba(255, 159, 64, 1)',
      backgroundColor: 'rgba(255, 159, 64, 0.2)',
      tension: 0.3,
      fill: true
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: { title: { display: true, text: '시간' } },
      y: { beginAtZero: true, title: { display: true, text: 'T 값' } }
    }
  }
});

// Firebase 실시간 데이터 수신
onValue(dataRef, (snapshot) => {
  const data = snapshot.val();
  if (data) {
    const R = data.R;
    const S = data.S;
    const T = data.T;

    // 텍스트 표시
    document.getElementById('r-value').textContent = `R: ${R}`;
    document.getElementById('s-value').textContent = `S: ${S}`;
    document.getElementById('t-value').textContent = `T: ${T}`;

    // 수질 상태 예시 로직
    const status = (R < 300 && S < 300 && T < 300) ? '양호' : '주의 필요';
    document.getElementById('status').textContent = `현재 수질 상태: ${status}`;

    // 그래프에 실시간 데이터 추가
    const now = new Date().toLocaleTimeString();

    rChart.data.labels.push(now);
    rChart.data.datasets[0].data.push(R);

    sChart.data.labels.push(now);
    sChart.data.datasets[0].data.push(S);

    tChart.data.labels.push(now);
    tChart.data.datasets[0].data.push(T);

    // 최대 데이터값 저장
    const maxLen = 100;
    [rChart, sChart, tChart].forEach(chart => {
      if (chart.data.labels.length > maxLen) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
      }
      chart.update();
    });
  }
});
