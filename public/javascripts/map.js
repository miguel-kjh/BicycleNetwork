var map = L.map('main_map').setView([ 27.851925, -15.437348 ], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

$.ajax({
    method: 'POST',
    dataType: 'json',
    url: 'api/auth/authenticate',
    data: { email: 'dir1ma8209@gmail.com', password: '1234' },
}).done(function( data ) {
    $.ajax({
        dataType: 'json',
        url: 'api/bicycles',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("x-access-token", data.data.token);
        }
    }).done(function (result) {
        result.bicycles.forEach(bicycle => {
            L.marker(bicycle.localitation, { title: bicycle.id }).addTo(map);
        });
    });
});