//section for dimmer element
function addDimmerElement(object) {
    console.log(object)
    var template = $('#dimmerTemplate').html();
    template = template.replace("tempName", object['Name'])
    template = template.replace("tempDate", object['LastUpdate'])
    template = template.replace("tempIdx", object['idx'])
    template = template.replace("tempSliderIdx", 'slider' + object['idx'.toString()])
    
    if (object['Status'] == 'Off') {
        template = template.replace("tempStatus", object['Status'])
        if (object['Image'] == "Light") template = template.replace("tempIcon", 'fa fa-lightbulb-o fa-3x lampOff')
        else if (object['Image'] == "WallSocket") template = template.replace("tempIcon", 'fa fa-plug fa-3x socketOff')
        else if (object['Image'] == "TV") template = template.replace("tempIcon", 'fa fa-television fa-3x tvOff')
    } 
    else {
        template = template.replace("tempStatus", object['Level'].toString() + '%')
        if (object['Image'] == "Light") template = template.replace("tempIcon", 'fa fa-lightbulb-o fa-3x lampOn')
        else if (object['Image'] == "WallSocket") template = template.replace("tempIcon", 'fa fa-plug fa-3x socketOn')
        else if (object['Image'] == "TV") template = template.replace("tempIcon", 'fa fa-television fa-3x tvOn')
    }
    $('#mainRow').append(template);
    if (object['Status'] == 'Off') {
        $('#slider'+ object['idx'].toString()).val(0);
    }
    else {
        $('#slider'+ object['idx'].toString()).val(object['Level']);
    }
    $('#' + object['idx'].toString()).on('click', function() {
        clickDimmerElement($(this));
    });
    $('#slider'+ object['idx'].toString()).bind('click', function() {
        onChangeDimmerElement($(this));
        return false;
    });
}

function onChangeDimmerElement(object){
    let id = $(object).attr('id').substring(6);
    window.socket.emit('changeDimmer', { 'idx': id, 'level': object.val()})
}

function clickDimmerElement(object) {
    let status = $(object).find('.status').children().html()
    if (status == 'Off') status = 'On'; //toggle device state 
    else status = 'Off' //toggle device state 
    window.socket.emit('clickDeviceLight', { 'idx': $(object).attr('id'), 'state': status})
}

function updateDimmerElement(object){
    if (object['Status'] == 'Off') {
        $('#slider'+ object['idx'].toString()).val(0);
        if (object['Image'] == "Light") {
            $('#' + object['idx']).find('i').removeClass('lampOn');
            $('#' + object['idx']).find('i').addClass('lampOff');
        }
        $('#' + object['idx']).find('.status').children().html('Off')
    }
    else {
        $('#slider'+ object['idx'].toString()).val(object['Level']);
        if (object['Image'] == "Light") {
            $('#' + object['idx']).find('i').removeClass('lampOff');
            $('#' + object['idx']).find('i').addClass('lampOn');
        }
        $('#' + object['idx']).find('.status').children().html(object['Level'].toString() + '%')
    }
}

//------------------------------------------

//section for light widget
function addLightElement(object) {
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
    $('#' + object['idx'].toString()).bind('click', function() {
        clickLightElement($(this))
    });
}

function clickLightElement(object) {
    let status = $(object).find('.status').children().html()
    if (status == 'Off') status = 'On'; //toggle device state 
    else if (status == 'On') status = 'Off' //toggle device state 
    window.socket.emit('clickDeviceLight', { 'idx': $(object).attr('id'), 'state': status})
}

function updateLightElement(object) {
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
//------------------------------------------

function elementCreator(object){
    console.log(object['SwitchType']);
    if (object['SwitchType'] == 'On/Off'){
        addLightElement(object);
    }
    else if (object['SwitchType'] == 'Dimmer'){
        addDimmerElement(object);
    }
}

function elementUpdater(object){
    if (object['SwitchType'] == 'On/Off'){
        updateLightElement(object);
    }
    else if (object['SwitchType'] == 'Dimmer'){
        updateDimmerElement(object);
    }
}

$(document).ready(function () {
    namespace = '/desktop'
    window.socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port + namespace, {
        reconnection: false
    });

    window.socket.on('getLightDevice', function (msg) {
        var data = eval('(' + msg.data + ')');
        data.forEach(elementCreator);
    });

    window.socket.on('updateLightDevice', function (msg) {
        var data = eval('(' + msg.data + ')');
        data.forEach(elementUpdater);
    });

    setInterval(function () {
        window.socket.emit('updateStatusOfFavoriteDevicesLight')
    }, 2000);

    window.socket.emit('getStatusOfFavoriteDevicesLight')

    $(document).on('input', '#slider', function() {
        console.log( $(this).val() );
    });
});