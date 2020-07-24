//section for dimmer element
function addDimmerElement(object) {
    var template = $('#dimmerTemplate').html();
    template = template.replace("tempName", object['Name'])
    template = template.replace("tempDate", object['LastUpdate'])
    template = template.replace("tempIdx", object['idx'])
    template = template.replace("tempSliderIdx", 'slider' + object['idx'.toString()])
    template = template.replace("tempIconIdx", 'icon' + object['idx'.toString()])
    
    if (object['Status'] == 'Off') template = template.replace("tempStatus", object['Status']);
    else template = template.replace("tempStatus", object['Level'].toString() + '%');
    $('#mainRow').append(template);
    setIconSetState(object['idx'], object['Image'], object['Status'])
    if (object['Status'] == 'Off') $('#slider'+ object['idx'].toString()).val(0);
    else $('#slider'+ object['idx'].toString()).val(object['Level']);
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
    parent = $('#'+ object['idx'].toString())
    if (parent.find('p').html() != object['Status'])
    {
        parent.find('p').html(object['Status'])
        if (object['Status'] == 'Off') {
            $('#slider'+ object['idx'].toString()).val(0);
            setState(object['idx'], object['Image'], 'Off');
            $('#' + object['idx']).find('.status').children().html('Off')
        }
        else {
            $('#slider'+ object['idx'].toString()).val(object['Level']);
            setState(object['idx'], object['Image'], 'On');
            $('#' + object['idx']).find('.status').children().html(object['Level'].toString() + '%')
        }
        $('#' + object['idx']).find('.date').children().html(object['LastUpdate'])
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
    template = template.replace("tempIconIdx", 'icon' + object['idx'])
    $('#mainRow').append(template);
    setIconSetState(object['idx'], object['Image'], object['Status'])
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
            setState(object['idx'], object['Image'], 'On');
        }
        else {
            setState(object['idx'], object['Image'], 'Off');
        }
    }
    if ($('#' + object['idx']).find('.date').children().html() != object['Status']) {
        $('#' + object['idx']).find('.date').children().html(object['LastUpdate'])
    }
}
//------------------------------------------

function elementCreator(object){
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