$("#backButton").click(function sendConfg(){
    window.location.replace(location.protocol + '//' + document.domain + ':' + location.port + '/')
});

$("#configButton").click(function sendConfg(){
    data = {
        'controller_ip': $('#domoticzAddress').val(),
        'controller_port': $('#domoticzPort').val(),
        'controller_username': $('#domoticzUser').val(),
        'controller_password': $('#domoticzPassword').val()
    }
    window.socket.emit('sendConfig', data)
    $("#successDBAlert").show()
    setTimeout(function () {
        $("#successDBAlert").hide()
    }, 2000);
});

$(document).ready(function () { 
    namespace = '/settings'
    window.socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port + namespace, {
        reconnection: true
    });

    window.socket.on('getFullConfig', function (msg) {
        var data = eval('(' + msg.data + ')');
        $("#domoticzAddress").val(data['controller_ip']);
        $("#domoticzPort").val(data['controller_port']);
        $("#domoticzUser").val(data['controller_username']);
        $("#domoticzPassword").val("HaHa! No way...");
    });

    window.socket.emit('getFullConfig')
});