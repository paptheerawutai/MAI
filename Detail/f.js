// ฟังก์ชันสำหรับดึงข้อมูลจาก APIข้อมูลAlarm
const receivedData = localStorage.getItem("sharedData");
const numberValue = Number(receivedData);
console.log(receivedData);

async function fetchAlarmData() {
//   const response = await fetch("https://api2-3jym.onrender.com/api/Data_Alarm");
//   return response.json();

  const response = await fetch("https://api2-3jym.onrender.com/api/Data_Alarm");
  const data = await response.json();
  console.log(data); // แสดงข้อมูลใน console
  return data;
}

// ฟังก์ชันสำหรับประมวลผลข้อมูลตามช่วงวันที่
async function prepareData(startDate, endDate) {
  const data = await fetchAlarmData();

  const filteredData_ = data.filter(item => item.input_ID === numberValue);
  console.log(filteredData_);


  const losstimeData = {};
  const alarmCountData = {};

  filteredData_.forEach(item => {
      const date = item.Data;
      
      const itemDate = new Date(date);
      if (itemDate >= startDate && itemDate <= endDate) {
          if (!losstimeData[date]) losstimeData[date] = 0;
          const timeEndInSeconds = convertTimeToSeconds(item.time_End);
          losstimeData[date] += timeEndInSeconds;

          if (!alarmCountData[date]) alarmCountData[date] = 0;
          alarmCountData[date]++;
      }
  });

  // เรียงลำดับวันที่
  const sortedLosstimeData = Object.keys(losstimeData).sort().reduce((acc, key) => {
      acc[key] = losstimeData[key];
      return acc;
  }, {});

  const sortedAlarmCountData = Object.keys(alarmCountData).sort().reduce((acc, key) => {
      acc[key] = alarmCountData[key];
      return acc;
  }, {});

  return { losstimeData: sortedLosstimeData, alarmCountData: sortedAlarmCountData };
}

// ฟังก์ชันแปลงเวลาเป็นวินาที
function convertTimeToSeconds(timeStr) {
  const [hours, minutes, seconds] = timeStr.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}

// ฟังก์ชันสำหรับสร้างกราฟ
let losstimeChart, alarmChart;

async function updateCharts() {
  let startDate = new Date(document.getElementById("startDate").value);
  let endDate = new Date(document.getElementById("endDate").value);

  // ถ้ายังไม่ได้เลือกวันที่ ให้ใช้ค่าเริ่มต้นย้อนหลัง 30 วัน
  if (isNaN(startDate) || isNaN(endDate)) {
      endDate = new Date(); // วันนี้
      startDate = new Date();
      startDate.setDate(endDate.getDate() - 29); // ย้อนหลัง 30 วัน

      // ตั้งค่าให้ Date Picker แสดงวันที่เริ่มต้นและสิ้นสุดตามค่าเริ่มต้น
      document.getElementById("startDate").value = startDate.toISOString().split('T')[0];
      document.getElementById("endDate").value = endDate.toISOString().split('T')[0];
  }

  const { losstimeData, alarmCountData } = await prepareData(startDate, endDate);

  const losstimeLabels = Object.keys(losstimeData);
  const losstimeValues = Object.values(losstimeData);

  if (losstimeChart) losstimeChart.destroy();
  losstimeChart = new Chart(document.getElementById('losstimeChart'), {
      type: 'line',
      data: {
          labels: losstimeLabels,
          datasets: [{
              label: 'Losstime (in seconds)',
              data: losstimeValues,
              backgroundColor: 'rgba(0, 209, 255, 0.3)',
              borderColor: 'rgba(0, 209, 255, 1)',
              borderWidth: 1,
              fill: true
          }]
      },
      options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
              x: { title: { display: true, text: 'Date', color: '#00d1ff', font: { size: 14, weight: 'bold' } } },
              y: { title: { display: true, text: 'Losstime (seconds)', color: '#00d1ff', font: { size: 14, weight: 'bold' } } }
          }
      },
      plugins: {
        datalabels: {
            display: true,
            align: 'top',
            color: '#00d1ff', // สีของตัวเลขที่แสดงบนหัวกราฟ
            font: {
                weight: 'bold',
                size: 12
            },
            formatter: function(value) {
                return value; // แสดงค่าเป็นตัวเลข
            }
        }
    }
    



  });

  const alarmLabels = Object.keys(alarmCountData);
  const alarmValues = Object.values(alarmCountData);

  if (alarmChart) alarmChart.destroy();
  alarmChart = new Chart(document.getElementById('alarmChart'), {
      type: 'line',
      data: {
          labels: alarmLabels,
          datasets: [{
              label: 'Alarm Count',
              data: alarmValues,
              backgroundColor: 'rgba(255, 99, 132, 0.3)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
              fill: true
          }]
      },
      options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
              x: { title: { display: true, text: 'Date', color: '#ff6384', font: { size: 14, weight: 'bold' } } },
              y: { title: { display: true, text: 'Alarm Count', color: '#ff6384', font: { size: 14, weight: 'bold' } } }
          }
      }
  });
}

// เรียกฟังก์ชันสร้างกราฟครั้งแรกเมื่อหน้าโหลด
updateCharts();
