
const apiUrl = "https://api2-1-s6j1.onrender.com/api/input_realtime";
const alarmApiUrl = "https://api2-1-s6j1.onrender.com/api/alarm1"; 
// require('dotenv').config();
// require('dotenv').config();
// const apiKey = process.env.API_KEY;
// const apiUrl = `${apiKey}/api/input_realtime`
// const alarmApiUrl = `${apiKey}/api/alarm1`



// const apiKey = process.env.API_KEY;
// const apiUrl = `${apiKey}/api/input_realtime`;
// const alarmApiUrl = `${apiKey}/api/alarm1`;

console.log('API URL:', apiUrl);
console.log('Alarm API URL:', alarmApiUrl);







document.addEventListener("DOMContentLoaded", function() {
    // ตรวจสอบการมีอยู่ของปุ่ม toggleDashboard ละกำหนด event listener
    const toggleButton = document.getElementById('toggleDashboard1');
    if (toggleButton) {
        toggleButton.addEventListener('click', function() {
            const dashboardSection = document.querySelector('.dashboard-section');
            if (dashboardSection) {
                dashboardSection.classList.toggle('active');
            }
        });
    } else {
        console.error("Element with id 'toggleDashboard' not found.");
    }

    // ตั้งชื่อ input เองและรายละเอียดสำหรับการแสดงในตาราง
    const inputNames = [
        "Pump", "Camp", "Back Door", "Front Door", "Inj_Back", 
        "Buzzer_MC", "Auto_MC", "Mold_open", "Auto_Robot", "Alarm_Robot", 
        "Safety_R_ON", "Check", "Count", "Robot_Run","1","2"
    ];

    const inputDetails = [
        { description: "เซนเซอร์จาก ปั๊ม จะมีการบอกสถานะการทำงานของ ปั๊ม", status: "ทำงานปกติ" },
        { description: "เซนเซอร์จาก ปิดโมล เป็นการเช็คแคมล็อก", status: "ทำงานปกติ" },
        { description: "Status ของ ประตูหน้า ", status: "ทำงานปกติ" },
        { description: "Status ของ ประตูหลัง ", status: "ทำงานปกติ" },
        { description: "เซนเซอร์จาก กระทุ้งกลับสุด จะมีการบอกสถานะการทำงานของกระทุ้งกลับสุดไหม", status: "ทำงานปกติ" },
        { description: "buzzer  MC_Alarm", status: "ทำงานปกติ" },
        { description: "Auto mode ทำงานออโต้", status: "ทำงานปกติ" },
        { description: "เซนเซอร์จาก เปิดโมล เป็นการเช็คโมลเปิดสุด", status: "ทำงานปกติ" },
        { description: "Unused input", status: "ทำงานปกติ" },
        { description: "Unused input", status: "ทำงานปกติ" },
        { description: "Unused input", status: "ทำงานปกติ" },
        { description: "Unused input", status: "ทำงานปกติ" },
        { description: "Unused input", status: "ทำงานปกติ" },
        { description: "Unused input", status: "ทำงานปกติ" },
        { description: "Unused input", status: "ทำงานปกติ" },
        { description: "Unused input", status: "ทำงานปกติ" }
    ];

    // ฟังก์ชันดึงข้อมูล input
    function fetchInputStatus() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => updateInputStatus(data[0]))
            .catch(error => console.error('Error fetching input data:', error));
    }

    

    // ฟังก์ชันอัปเดตข้อมูล input ในแดชบอร์ด
    function updateInputStatus(data) {
        const dashboard = document.getElementById('dashboard');
        dashboard.innerHTML = '';

        for (let i = 1; i <= 14; i++) {
            const inputStatus = document.createElement('div');
            inputStatus.className = 'dashboard-item';

            // เปลี่ยนสีตามค่าของ input
            if (data[`input_${i}`] === 1) {
                inputStatus.classList.add('active');
            }

            inputStatus.textContent = `${inputNames[i - 1]}: ${data[`input_${i}`]}`;
            inputStatus.addEventListener('click', () => showDetails('input', i - 1, data[`input_${i}`]));
            dashboard.appendChild(inputStatus);
        }
    }

    // ฟังก์ชันดึงข้อมูล alarm
    function fetchAlarmStatus() {
        fetch(alarmApiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => updateAlarmPoints(data[0]))
            .catch(error => console.error('Error fetching alarm data:', error));
    }
    // ฟังก์ชันอัปเดตสีของจุด alarm ในฉาก
    function updateAlarmPoints(data) {
        alarmPoints.forEach((alarmPoint, index) => {
            const alarmKey = `input_${index + 1}`;
            alarmPoint.material.color.set(data[alarmKey] === 1 ? 0xff0000 : 0x00ff00);
        });
    }

    // Scene setup
    const color_backG = new THREE.Color("#0d0f1b");
    const scene = new THREE.Scene();
    scene.background = color_backG;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(7, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(17.5, 5, 18);
    // camera.position.set(17.5, 5, 18);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    // renderer.setSize(window.innerWidth/1.45, window.innerHeight/1.45);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.setSize(1300, 700);
    document.getElementById('3d-container').appendChild(renderer.domElement);

    // Controls setup
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    // Light setup
    const frontLight = new THREE.DirectionalLight(0xffffff, 1);
    frontLight.position.set(5, 10, 7.5);
    scene.add(frontLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.8);
    backLight.position.set(-5, 10, -7.5);
    scene.add(backLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Load FBX object and set up alarm points
    const loader = new THREE.FBXLoader();
    let alarmPoints = [];
    //  53b2e7b9-9092-463b-86d2-afa54ed575e6   ||  9b223805-b73f-4f4b-a5b5-d6e47daa1273
    loader.load('53b2e7b9-9092-463b-86d2-afa54ed575e6.fbx', (object) => {

        const F_l =  0.25  ,z_D = -0.9; //+0.6
        object.scale.set(0.0175, 0.0175, 0.0175);
        object.position.set(-2.8-F_l, 0+z_D, 0-0.5-0.2);  //-2.8
        scene.add(object);
        const x = 0.2, y = -0.25-0.2, z = 0.6; 
        const alarmPointPositions = [
    
            new THREE.Vector3(-0.5-F_l, 0.80 + z +z_D, 0.5 + y),   //แคมไม่ล็อก                    1
            new THREE.Vector3(0.55 + 1.5-F_l, 0.55 +z_D, -0.3 + y), //ปั้ม                        2
            new THREE.Vector3(0.55 + x-F_l, 0.87 + z+z_D, 1.5 + y), //ประตูหน้าเปิดค้าง             3
            new THREE.Vector3(0.5 + x-F_l, 1.25 + z+z_D, 0.5 + y), //โมลไม่เปิด                   4
            new THREE.Vector3(-1 + x-F_l, 1.25 + z+z_D, 0.5 + y), // โมลไม่ปิด                    5 
            new THREE.Vector3(-0.05-F_l, 0.80 + z+z_D, 0.5 + y), // กระทุ่งไม่กลับ  -  ไม่กระทุ่ง       6
            new THREE.Vector3(-0.2-F_l, 0.80 + z+z_D, 0.5 + y),  // กระทุ่งไม่กลับ  -  ไม่กระทุ่ง      7
            new THREE.Vector3(0.665 -0.5-F_l , 0.16+0.7+z_D, 2.41+ y)  // Robot
        ];
        const alarmMessages = [
            "แคมไม่ล็อก: กรุณาตรวจสอบตำแหน่งของแคม", // ข้อความที่จะแสดงสำหรับตำแหน่งที่ 1
            "ปั้มทำงานผิดพลาด: กรุณาตรวจสอบการทำงานของปั้มว่าดับไหม", // ข้อความที่จะแสดงสำหรับตำแหน่งที่ 2
            "ประตูหน้าเปิดค้าง: โปรดปิดประตูหน้าเพื่อความปลอดภัย", // ข้อความที่จะแสดงสำหรับตำแหน่งที่ 3
            "โมลไม่เปิด: กรุณาตรวจสอบตำแหน่งโมลปิดสุด", // ข้อความที่จะแสดงสำหรับตำแหน่งที่ 4
            "โมลไม่ปิด: กรุณาตรวจสอบตำแหน่งโมลเปิดสุด", // ข้อความที่จะแสดงสำหรับตำแหน่งที่ 5
            "กระทุ้งไม่กลับ: กรุณาตรวจสอบการทำงานของกระทุ้ง", // ข้อความที่จะแสดงสำหรับตำแหน่งที่ 6
            "ไม่กระทุ้ง: กรุณาตรวจสอบเครื่อง และ จุดกระทุ้ง", // ข้อความที่จะแสดงสำหรับตำแหน่งที่ 7
            "Robot ค้าง: กรุณาตรวจสอบการทำงานของ Robot " // ข้อความที่จะแสดงสำหรับตำแหน่งที่ 8
        ];

        // alarmPointPositions.forEach((position, index) => {
        //     const alarmPoint = createAlarmPoint(position, `Alarm ${index + 1} triggered!`);
        //     alarmPoints.push(alarmPoint);
        //     scene.add(alarmPoint);
        // });
        alarmPointPositions.forEach((position, index) => {
            const alarmPoint = createAlarmPoint(position, alarmMessages[index]);
            alarmPoints.push(alarmPoint);
            scene.add(alarmPoint);
        });
        
    });
    // alarm point
    // เพิ่มการฟังเหตุการณ์ touchstart สำหรับอุปกรณ์พกพา
    window.addEventListener('touchstart', handleTouch);
    // window.addEventListener('click', handleClick); // ใช้ click บนเดสก์ท็อป

        function handleTouch(event) {
            checkIntersection(event.touches[0].clientX, event.touches[0].clientY);
        }


        function checkIntersection(x, y) {
            const mouse = new THREE.Vector2(
                (x / window.innerWidth) * 2 - 1,
                -(y / window.innerHeight) * 2 + 1
            );
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(scene.children);

            if (intersects.length > 0) {
                const object = intersects[0].object;
                if (object.userData.message) {
                    showDetails('alarm', null, object.userData.message);
                }
            }
        }
    // alarm point





    // ฟังก์ชันสร้าง alarm point
    function createAlarmPoint(position, alarmMessage) {
        const alarmPoint = new THREE.Mesh(
            new THREE.SphereGeometry(0.05, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0xff0000 })
        );
        alarmPoint.position.copy(position);
        alarmPoint.userData = { message: alarmMessage };
        return alarmPoint;
    }

    // โชว์ข้อมูล
    // function showDetails(type, index, value) {
    //     const infoBox = document.getElementById('infoBox-1');
    //     const infoTable = document.getElementById('infoTable');

    //     if (infoBox.style.display === "none" || infoBox.style.display === "") {
    //         if (type === 'input') {
    //             infoTable.innerHTML = `
    //                 <tr><th>Attribute</th><th>Value</th></tr>
    //                 <tr><td>Name</td><td>${inputNames[index]}</td></tr>
    //                 <tr><td>Description</td><td>${inputDetails[index].description}</td></tr>
    //                 <tr><td>Status</td><td>${inputDetails[index].status}</td></tr>
    //                 <tr><td>Current Value</td><td>${value}</td></tr>
    //             `;
    //         } else if (type === 'alarm') {
    //             infoTable.innerHTML = `<tr><td>${value}</td></tr>`;
    //         }
    //         infoBox.style.display = "block";
    //     } else {
    //         infoBox.style.display = "none";
    //     }
    // }

    function showDetails(type, index, value) {
        const infoBox = document.getElementById('infoBox-1');
        const infoTable = document.getElementById('infoTable');
    
        if (infoBox.style.display === "none" || infoBox.style.display === "") {
            if (type === 'input') {
                infoTable.innerHTML = `
                    <tr><th>Attribute</th><th>Value</th></tr>
                    <tr><td>Name</td><td>${inputNames[index]}</td></tr>
                    <tr><td>Description</td><td>${inputDetails[index].description}</td></tr>
                    <tr><td>Status</td><td>${inputDetails[index].status}</td></tr>
                    <tr><td>Current Value</td><td>${value}</td></tr>
                    <tr><td colspan="2">
                        <button onclick="window.location.href='../'">ดูข้อมูล</button>
                    </td></tr>
                `;
            } else if (type === 'alarm') {
                infoTable.innerHTML = `
                    <tr><td>${value}</td></tr>
                    <tr><td colspan="2">
                        <button onclick="window.location.href='http://localhost/api_SystemMAI/HH/G/index2.html'">วิธีการแก้ปัญหา Alarm</button>
                    </td></tr>
                `;
            }
            infoBox.style.display = "block";
        } else {
            infoBox.style.display = "none";
        }
    }
    

    // Click event to show alarm details
    window.addEventListener('click', (event) => {
        const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0 && intersects[0].object.userData.message) {
            showDetails('alarm', null, intersects[0].object.userData.message);
        }
    });

    // เรียกใช้ fetchInputStatus และ fetchAlarmStatus ทุกๆ 500 ms
    setInterval(fetchInputStatus, 1500);
    setInterval(fetchAlarmStatus, 1500);
});
