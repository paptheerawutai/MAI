
async function fetchMachineData() {
    try {
        const response = await fetch("https://api2-1-s6j1.onrender.com/api/user_mc");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching machine data:", error);
        return [];
    }
}

// ฟังก์ชันสำหรับตรวจสอบสถานะเครื่องจักรและอัปเดตไฟ
function updateLightsBasedOnStatus(machineStatus) {
    const greenLight = document.getElementById('light-green');
    const orangeLight = document.getElementById('light-orange');
    const redLight = document.getElementById('light-red');

    // รีเซ็ตไฟทั้งหมด
    greenLight.classList.remove('active');
    orangeLight.classList.remove('active');
    redLight.classList.remove('active');

    // ตรวจสอบสถานะเครื่องจักรและอัปเดตไฟ
    if (machineStatus.Machine !== "Normal") {
        redLight.classList.add('active');
        orangeLight.classList.add('active'); 
    } else if (machineStatus.Robot3Axis !== "Normal" || machineStatus.Robot6Axis !== "Normal") {
        greenLight.classList.add('active'); 
        orangeLight.classList.add('active'); 
    } else {
        greenLight.classList.add('active'); 
    }
}

// ฟังก์ชันหลักสำหรับดึงข้อมูลจาก API และอัปเดตไฟ
async function main() {
    const data = await fetchMachineData();

    // ตรวจสอบข้อมูลของเครื่องจักรเครื่องแรก (เปลี่ยนได้ตามเงื่อนไขที่ต้องการ)
    if (data.length > 0) {
        const machineStatus = {
            Machine: data[0].Machine.Machine,
            Robot3Axis: data[0].Robot3Axis.Robot3Axis,
            Robot6Axis: data[0].Robot6Axis.Robot6Axis
        };

        updateLightsBasedOnStatus(machineStatus);
    }
}

// เรียกใช้ฟังก์ชันหลักเมื่อโหลดหน้า
main();


// ทดสอบการอัปเดตสถานะไฟในช่วงเวลา
// เรียกใช้ฟังก์ชันหลักเป็นระยะทุก ๆ 2 วินาที
setInterval(main, 2000); // ดึงข้อมูลจาก API และอัปเดตไฟทุก ๆ 2 วินาที

