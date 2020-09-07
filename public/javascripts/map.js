var map = L.map('main_map').setView([ 27.851925, -15.437348 ], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

$.ajax({
    dataType: "json",
    url: "api/bicycles",
    success: function (result) { 
        console.log(result);
        result.bicycles.forEach(element => {
            L.marker(
                element.localitation,
                {title: element.code}
                ).addTo(map);
        });
    }
});