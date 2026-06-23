let bikes = [];
let currentIndex = -1;

// Load
window.onload = function () {
    loadData();
    updateDashboard();
    setDateTime();
};

// Date Time
function setDateTime() {
    let now = new Date();
    document.getElementById("scanDate").value = now.toISOString().split("T")[0];
    document.getElementById("scanTime").value = now.toTimeString().slice(0,5);
}

// Save
document.getElementById("saveBtn").addEventListener("click", function () {

    let bike = getData();
    if (!bike) return;

    // Duplicate check
    let dup = bikes.find(b =>
        b.chassisNumber === bike.chassisNumber ||
        b.motorNumber === bike.motorNumber
    );

    if (dup) {
        alert("Duplicate chassis or motor number!");
        return;
    }

    bikes.push(bike);
    currentIndex = bikes.length - 1;

    saveData();
    updateDashboard();
    clearForm();
    setDateTime();

    alert("Saved!");
});

// Get Data
function getData() {

    let modelName = document.getElementById("modelName").value;
    let batteryType = document.getElementById("batteryType").value;
    let bikeType = document.getElementById("bikeType").value;
    let color = document.getElementById("color").value;
    let chassisNumber = document.getElementById("chassisNumber").value;
    let motorNumber = document.getElementById("motorNumber").value;

    if (!modelName || !bikeType || !chassisNumber || !motorNumber) {
        alert("Fill required fields!");
        return null;
    }

    return {
        date: document.getElementById("scanDate").value,
        time: document.getElementById("scanTime").value,
        modelName,
        batteryType,
        bikeType,
        color,
        chassisNumber,
        motorNumber
    };
}

// Save Local
function saveData() {
    localStorage.setItem("bikes", JSON.stringify(bikes));
}

// Load
function loadData() {
    let data = localStorage.getItem("bikes");
    if (data) bikes = JSON.parse(data);
}

// Clear
document.getElementById("clearBtn").addEventListener("click", clearForm);

function clearForm() {
    document.getElementById("modelName").value = "";
    document.getElementById("batteryType").value = "";
    document.getElementById("bikeType").value = "";
    document.getElementById("color").value = "";
    document.getElementById("chassisNumber").value = "";
    document.getElementById("motorNumber").value = "";
}

// Navigation
document.getElementById("nextBtn").onclick = () => {
    if (currentIndex < bikes.length - 1) {
        currentIndex++;
        show();
    }
};

document.getElementById("prevBtn").onclick = () => {
    if (currentIndex > 0) {
        currentIndex--;
        show();
    }
};

document.getElementById("firstBtn").onclick = () => {
    currentIndex = 0;
    show();
};

document.getElementById("lastBtn").onclick = () => {
    currentIndex = bikes.length - 1;
    show();
};

// Show
function show() {
    let b = bikes[currentIndex];

    document.getElementById("scanDate").value = b.date;
    document.getElementById("scanTime").value = b.time;
    document.getElementById("modelName").value = b.modelName;
    document.getElementById("batteryType").value = b.batteryType;
    document.getElementById("bikeType").value = b.bikeType;
    document.getElementById("color").value = b.color;
    document.getElementById("chassisNumber").value = b.chassisNumber;
    document.getElementById("motorNumber").value = b.motorNumber;

    updateDashboard();
}

// Delete
document.getElementById("deleteBtn").onclick = () => {

    if (currentIndex < 0) return;

    if (!confirm("Delete this record?")) return;

    bikes.splice(currentIndex, 1);

    saveData();
    updateDashboard();
    clearForm();
};

// Search
document.getElementById("searchBtn").onclick = () => {

    let q = document.getElementById("searchInput").value.toLowerCase();

    let i = bikes.findIndex(b =>
        b.chassisNumber.toLowerCase() === q ||
        b.motorNumber.toLowerCase() === q
    );

    if (i !== -1) {
        currentIndex = i;
        show();
    } else {
        alert("Not found");
    }
};

// Dashboard
function updateDashboard() {

    document.getElementById("totalBikes").innerText = bikes.length;

    let l = bikes.filter(b => b.bikeType === "Lithium").length;
    let g = bikes.filter(b => b.bikeType === "Graphene").length;

    document.getElementById("lithiumCount").innerText = l;
    document.getElementById("grapheneCount").innerText = g;

    document.getElementById("recordPosition").innerText =
        bikes.length ? (currentIndex + 1) + " / " + bikes.length : "0 / 0";
}

// Export Excel
document.getElementById("exportBtn").onclick = () => {

    if (!bikes.length) return alert("No data");

    let data = bikes.map(b => ({
        Date: b.date,
        Time: b.time,
        Model: b.modelName,
        Battery: b.batteryType,
        Type: b.bikeType,
        Color: b.color,
        Chassis: b.chassisNumber,
        Motor: b.motorNumber
    }));

    let ws = XLSX.utils.json_to_sheet(data);
    let wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "EVEE Bikes");

    XLSX.writeFile(wb, "EVEE_Bikes.xlsx");
};
