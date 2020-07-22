//section for light widget
function addLightElement(object) {
    if (object['SwitchType'] == 'On/Off') {
        var template = $('#lightTemplate').html();
        template = template.replace("tempName", object['Name'])
        template = template.replace("tempStatus", object['Status'])
        template = template.replace("tempDate", object['LastUpdate'])
        template = template.replace("tempIdx", object['idx'])
        if (object['Status'] == 'On') {
            if (object['Image'] == "Light") template = template.replace("tempIcon", 'fa fa-lightbulb-o fa-3x lampOn')
            else if (object['Image'] == "WallSocket") template = template.replace("tempIcon", 'fa fa-plug fa-3x socketOn')
            else if (object['Image'] == "TV") template = template.replace("tempIcon", 'fa fa-television fa-3x tvOn')
        }
        else {
            if (object['Image'] == "Light") template = template.replace("tempIcon", 'fa fa-lightbulb-o fa-3x lampOff')
            else if (object['Image'] == "WallSocket") template = template.replace("tempIcon", 'fa fa-plug fa-3x socketOff')
            else if (object['Image'] == "TV") template = template.replace("tempIcon", 'fa fa-television fa-3x tvOff')
        } 
        $('#mainRow').append(template);
    }
}

function clickLightElement(his) {
    //console.log($(his).attr('id'))
    let status = $(his).find('.status').children().html()
    if (status == 'Off') status = 'On'; //toggle device state 
    else if (status == 'On') status = 'Off' //toggle device state 
    window.socket.emit('clickDeviceLight', { 'idx': $(his).attr('id'), 'state': status})
}

function updateLightElement(object) {
    if (object['SwitchType'] == 'On/Off') {
        if ($('#' + object['idx']).find('.status').children().html() != object['Status']) {
            $('#' + object['idx']).find('.status').children().html(object['Status'])
            if (object['Status'] == 'On') {
                if (object['Image'] == "Light") {
                    $('#' + object['idx']).find('i').removeClass('lampOff');
                    $('#' + object['idx']).find('i').addClass('lampOn');
                }
                else if (object['Image'] == "WallSocket") {
                    $('#' + object['idx']).find('i').removeClass('socketOff');
                    $('#' + object['idx']).find('i').addClass('socketOn');
                }
                else if (object['Image'] == "TV") {
                    $('#' + object['idx']).find('i').removeClass('tvOff');
                    $('#' + object['idx']).find('i').addClass('tvOn');
                }
            }
            else {
                if (object['Image'] == "Light") {
                    $('#' + object['idx']).find('i').removeClass('lampOn');
                    $('#' + object['idx']).find('i').addClass('lampOff');
                }
                else if (object['Image'] == "WallSocket") {
                    $('#' + object['idx']).find('i').removeClass('socketOn');
                    $('#' + object['idx']).find('i').addClass('socketOff');
                }
                else if (object['Image'] == "TV") {
                    $('#' + object['idx']).find('i').removeClass('tvOn');
                    $('#' + object['idx']).find('i').addClass('tvOff');
                }
            }
        }
        if ($('#' + object['idx']).find('.date').children().html() != object['Status']) {
            $('#' + object['idx']).find('.date').children().html(object['LastUpdate'])
        }
    }
}
//------------------------------------------

$(document).ready(function () {
    namespace = '/desktop'
    window.socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port + namespace, {
        reconnection: false
    });

    window.socket.on('getLightDevice', function (msg) {
        var data = eval('(' + msg.data + ')');
        data.forEach(addLightElement);
        console.log(data)
    });

    window.socket.on('updateLightDevice', function (msg) {
        var data = eval('(' + msg.data + ')');
        data.forEach(updateLightElement);
    });

    setInterval(function () {
        window.socket.emit('updateStatusOfFavoriteDevicesLight')
    }, 2000);

    window.socket.emit('getStatusOfFavoriteDevicesLight')
});