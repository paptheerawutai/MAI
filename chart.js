// ฟังก์ชันสำหรับดึงข้อมูลการ์ดจาก API
let IN_ID = "";
let Card_ID = "";


    async function fetchCardData() {
      try {
        const response = await fetch("https://api2-1-s6j1.onrender.com/api/sta_c");
        const data = await response.json();
        return data[0].entries;
      } catch (error) {
        console.error('Error fetching card data:', error);
      }
    }
    // ฟังก์ชันสำหรับดึงข้อมูลรายละเอียดจาก API
    async function fetchDetailsData() {
      try {
        const response = await fetch("https://api2-1-s6j1.onrender.com/api/Data_Alarm");
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching details data:', error);
      }
    }

    // ฟังก์ชันสำหรับแสดงรายละเอียดใน modal
    async function showDetails(inputID, name) {
      Card_ID = name;
      // console.log(" name :  " + name);
      const now = new Date();
      const timezoneOffset = 7 * 60 * 60 * 1000;   
      const localDatethai = new Date(now.getTime() + timezoneOffset);
      const date = localDatethai.toISOString().split('T')[0]; // ได้เฉพาะวันที่ในรูปแบบ YYYY-MM-DD

      document.getElementById('openModalButton')

      const modal = document.getElementById('detailsModal');   
      modal.style.display = 'flex';   
      
      IN_ID = inputID ;
      console.log(IN_ID);
      const data = await fetchDetailsData();

      const tableBody = document.getElementById('detailsTable').querySelector('tbody');
      tableBody.innerHTML = ''; // Clear existing data
      const today = new Date().toISOString().split('T')[0]; // วันที่ปัจจุบันในรูปแบบ YYYY-MM-DD
      // กรองข้อมูลเฉพาะ inputID ที่ถูกเลือกและแสดงข้อมูลล่าสุด 20 รายการ
      
      // console.log(date);
      // const filteredData_input = data.filter(item => item.input_ID === inputID );
      // console.log(filteredData_input);

      const filteredData = data.filter(item => item.input_ID === inputID && item.Data === date );
      console.log(filteredData); 
      
      document.getElementById('datePicker').value = date; // ตั้งค่าเป็นวันที่ปัจจุบัน
      createChart(filteredData); // สร้างกราฟตามข้อมูลที่กรองแล้ว
      
      

      const filteredData1 = data.filter(item => item.input_ID === inputID && item.Data === date ).slice(-20);  //กรองมาเพื่อกำหนด   ตาราง
      update_datePicker();
      if (filteredData1.length > 0) {
        filteredData1.forEach(item => {
          const row = document.createElement('tr'); 
          row.innerHTML = `
            <td>${item.Type}</td> 
            <td>${item.Data}</td>
            <td>${item.time_Start}</td>
            <td>${item.time_Stop || 'N/A'}</td>
            <td>${item.time_End || 'N/A'}</td>
          `;
          tableBody.appendChild(row);
          // update_datePicker();
        });
          //
      } else {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="5" style="text-align: center;">No data available</td>`;
        tableBody.appendChild(row);
      }
      

    }

    // ฟังก์ชันแปลงเวลาเป็นวินาที
    function parseTimeToSeconds(timeStr) {
      const [hours, minutes, seconds] = timeStr.split(':').map(Number);
      return (hours * 3600) + (minutes * 60) + seconds;
    }

    function sendData() {
      const data = IN_ID; // กำหนดค่าตัวแปรโดยตรงที่นี่
      console.log("data send is ok");
      console.log(data);
      localStorage.setItem("sharedData", data); // เก็บข้อมูลใน localStorage
      window.location.href = "../3D_MC/Detail/All.html"; // เปิดหน้าใหม่    "../3D_MC/Detail/ALL.html"
      // window.location.href = "page2.html";
  }

    // ฟังก์ชันสำหรับดึงข้อมูลและกรองตามวันที่ที่เลือก
    async function updateChart() {
      const tableBody = document.getElementById('detailsTable').querySelector('tbody');
      const selectedDate = document.getElementById('datePicker').value; // ดึงวันที่จาก Date Picker
      const data = await fetchDetailsData(); // ดึงข้อมูลทั้งหมดจาก API
      //const filteredData = data.filter(item => item.Data === selectedDate && item.inputID === IN_ID ); // กรองข้อมูลตามวันที่
      //const filteredData = data.filter(item => item.Data === selectedDate && item.inputID === IN_ID );
      //console.log(IN_ID+" และ " +selectedDate);
      //console.log(data.length)
      const filteredData = data.filter(item => item.Data === selectedDate );
      console.log(IN_ID); //กรองวัน
      const filteredData1 = filteredData.filter(item => item.Data === selectedDate && item.input_ID === IN_ID );
      //console.log(filteredData1); //กรอง 
      // console.log(IN_ID+" และ " + selectedDate);
      createChart(filteredData1); // สร้างกราฟตามข้อมูลที่กรองแล้ว
      
      // console.log(filteredData1.Data);


      tableBody.innerHTML = '';
      if (filteredData1.length > 0) {
        filteredData1.forEach(item => {
          const row = document.createElement('tr'); 
          row.innerHTML = `
            <td>${item.Type}</td> 
            <td>${item.Data}</td>
            <td>${item.time_Start}</td>
            <td>${item.time_Stop || 'N/A'}</td>
            <td>${item.time_End || 'N/A'}</td>
          `;
          tableBody.appendChild(row);
        });
      }




    }

    // function update_datePicker() {
      
    //   document.addEventListener("DOMContentLoaded", async function() {
    //     const now = new Date();
    //     const today = new Date().toISOString().split('T')[0]; // วันที่ปัจจุบันในรูปแบบ YYYY-MM-DD
    //     // แยกวันที่และเวลา  UTC+7  
    //     const timezoneOffset = 7 * 60 * 60 * 1000;   
    //     const localDatethai = new Date(now.getTime() + timezoneOffset);
    //     const date = localDatethai.toISOString().split('T')[0]; // ได้เฉพาะวันที่ในรูปแบบ YYYY-MM-DD
        
    //     document.getElementById('datePicker').value = date; // ตั้งค่าเป็นวันที่ปัจจุบัน
    //     console.log("today  วันนี้ = " + date);
    //     await updateChart();
    //   });

    //   document.getElementById('datePicker').addEventListener('change', updateChart);
    // } 
    // update_datePicker();
    
    function update_datePicker() { 
      document.addEventListener("DOMContentLoaded", async function() {
          const now = new Date();
          const timezoneOffset = 7 * 60 * 60 * 1000;   
          const localDatethai = new Date(now.getTime() + timezoneOffset);
          const date = localDatethai.toISOString().split('T')[0]; // ได้เฉพาะวันที่ในรูปแบบ YYYY-MM-DD

          document.getElementById('datePicker').value = date; // ตั้งค่าเป็นวันที่ปัจจุบัน
          console.log("today วันนี้ = " + date);
          showDetails(inputID,Card_ID);
          await updateChart();
      });
  
      document.getElementById('datePicker').addEventListener('change', updateChart);
  }
 
  

    function createChart(data) {
      const ctx = document.getElementById('lineChart').getContext('2d');
      // ลบกราฟเก่า (ถ้ามี)
      if (window.myBarChart) {
        window.myBarChart.destroy();
      }
    
      // เตรียมข้อมูลรายชั่วโมง
      const hourlyData = {};
      data.forEach(item => {
        const hour = item.time_Start.split(':')[0]; // แยกชั่วโมงจาก time_Start
    
        // นับจำนวน Alarm ในแต่ละชั่วโมง
        if (!hourlyData[hour]) {
          hourlyData[hour] = 0;
        }
        hourlyData[hour] += 1;
      });
    
      // จัดเรียงข้อมูลรายชั่วโมงเป็น array สำหรับกราฟ
      const hours = [...Array(24).keys()].map(h => String(h).padStart(2, '0')); // ชั่วโมง 00 - 23
      const chartData = hours.map(hour => hourlyData[hour] || 0); // จำนวน Alarm ในแต่ละชั่วโมง
    
      // สร้างกราฟแบบแท่ง
      window.myBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: hours,
          datasets: [
            {
              label: 'จำนวน Alarm ต่อชั่วโมง',
              data: chartData,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: '#ff6384',
              borderWidth: 1,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.dataset.label || '';
                  const value = context.raw;
                  return `${label}: ${value} ครั้ง`;
                }
              }
            }
          },
          scales: {
            y: {
              title: {
                display: true,
                text: 'จำนวนครั้งของ Alarm'
              },
              ticks: {
                callback: function(value) {
                  return `${value} ครั้ง`;
                }
              }
            },
            x: {
              title: {
                display: true,
                text: 'ชั่วโมง'
              }
            }
          }
        }
      });
    }
    

    // ฟังก์ชันสำหรับสร้างการ์ด
    async function generateCards() {
      const entries = await fetchCardData();
      const dashboard1 = document.getElementById('dashboard1');

      if (dashboard1) {
        dashboard1.innerHTML = ''; 

        const inputIDMapping = {
          "แคมไม่ล็อก": 1, 
          "ปั้มดับ": 2,
          "ประตูหน้าเปิดค้าง": 3, 
          "โมลไม่เปิด": 4, 
          "โมลไม่ปิด": 5,
          "กระทุ่งไม่กลับ": 6, 
          "ไม่กระทุ่ง": 7,
          //"Robot-3แกน ค้าง": 8,  
          //"Robot-6หยุด": 9,
        };

        entries.forEach(entry => {
          const card = document.createElement('div');
          card.className = 'card';
          const inputID = inputIDMapping[entry.name] || 0;
          card.onclick = () => showDetails(inputID, entry.name);
          
          card.innerHTML = `
            <h3>${entry.name}</h3>
          `;
            // <div class="info">
            //   <div><span>  All  </span> <span class="count">${entry.operational}</span></div>
            //   <div><span>  Chg  </span> <span class="count">${entry.pending}</span></div>
            //   <div><span>  Pm  </span> <span class="count">${entry.maintenance}</span></div>
            // </div>
          dashboard1.appendChild(card);
        });
      } else {
        console.error("Element with id 'dashboard1' not found.");
      }
    }

    // ฟังก์ชันปิด modal
    function closeDetails() {
      document.getElementById('detailsModal').style.display = 'none';
      console.log("กำลังปิดกราฟ");
      // fg2.innerHTML = "" ;
      if (window.myBarChart) {
        window.myBarChart.destroy();
        console.log("ปิดกราฟ-เรียบร้อย");
      }
    }

    // Generate cards on page load
    document.addEventListener("DOMContentLoaded", generateCards);