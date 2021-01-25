//section for temperature element

function addMotionSensor(object){
    var template = $('#sensorTemplate').html();
    template = template.replace("tempName", object['Name']);
    template = template.replace("tempStatus", object['Status']);
    template = template.replace("tempDate", object['LastUpdate']);
    template = template.replace("tempIdx", object['idx']);
    template = template.replace("tempIconIdx", 'icon' + object['idx']);
    $('#switchRow').append(template);
    setIconSetState(object['idx'], object['SwitchType'], object['Status']);
}

function updateMotionSensor(object){
    if ($('#' + object['idx']).find('.status').children().html() != object['Data']) {
        $('#' + object['idx']).find('.status').children().html(object['Data']);
        $('#' + object['idx']).find('.date').children().html(object['LastUpdate']);
        setState(object['idx'], object['SwitchType'], object['Status'])
    }
}

//------------------------------------------

//section for temperature element

function addTemperatureElement(object){
    var template = $('#sensorTemplate').html();
    template = template.replace("tempName", object['Name']);
    sensorData = object['Data'].replace("C", "°C").replace(",", " ").replace(",", " ");
    template = template.replace("tempStatus", sensorData);
    template = template.replace("tempDate", object['LastUpdate']);
    template = template.replace("tempIdx", object['idx']);
    template = template.replace("tempIconIdx", 'icon' + object['idx']);
    $('#sensorRow').append(template);
    setIcon(object['idx'], object['TypeImg']);
}

function updateTemperatureElement(object){
    sensorData = object['Data'].replace("C", "°C").replace(",", " ").replace(",", " ");
    if ($('#' + object['idx']).find('.status').children().html() != sensorData) {
        $('#' + object['idx']).find('.status').children().html(sensorData);
        $('#' + object['idx']).find('.date').children().html(object['LastUpdate']);
    }
}

//------------------------------------------

//section for blind element

function addBlindElement(object){
    var template = $('#blindTemplate').html();
    template = template.replace("tempName", object['Name']);
    template = template.replace("tempStatus", object['Status']);
    template = template.replace("tempDate", object['LastUpdate']);
    template = template.replace("tempIdx", object['idx']);
    template = template.replace("tempIconIdx", 'icon' + object['idx']);
    template = template.replace("tempDownIdx", 'down' + object['idx']);
    template = template.replace("tempStopIdx", 'stop' + object['idx']);
    template = template.replace("tempUpIdx", 'up' + object['idx']);
    $('#switchRow').append(template);
    setIcon(object['idx'], object['SwitchType'], object['Status']);
    $('#down' + object['idx'].toString()).bind('click', function() { //down
        clickBlindElement($(this), 'down');
    });
    $('#stop' + object['idx'].toString()).bind('click', function() { //stop
        clickBlindElement($(this), 'stop');
    });
    $('#up' + object['idx'].toString()).bind('click', function() { //up
        clickBlindElement($(this), 'up');
    });
}

function clickBlindElement(object, direction){
    let id;
    if (direction == 'up') id = $(object).attr('id').substring(2);
    else id = $(object).attr('id').substring(4);
    window.socket.emit('clickBlind', { 'idx': id, 'state': direction});
}

function updateBlindElement(object){
    if ($('#' + object['idx']).find('.status').children().html() != object['Status']) {
        $('#' + object['idx']).find('.status').children().html(object['Status']);
        $('#' + object['idx']).find('.date').children().html(object['LastUpdate']);
    }
}

//------------------------------------------

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
    $('#switchRow').append(template);
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
    $('#switchRow').append(template);
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

//section for selector widget

function addSelectorElement(object) {
    var template = $('#lightTemplate').html();
    template = template.replace("tempName", object['Name'])
    template = template.replace("tempStatus", object['Status'])
    template = template.replace("tempDate", object['LastUpdate'])
    template = template.replace("tempIdx", object['idx'])
    template = template.replace("tempIconIdx", 'icon' + object['idx'])
    $('#switchRow').append(template);
    setIconSetState(object['idx'], object['Image'], object['Status'])
}

//------------------------------------------

//------------------------------------------

function elementCreator(object){
    if (object['SwitchType'] == 'On/Off'){
        addLightElement(object);
    }
    else if (object['SwitchType'] == 'Dimmer'){
        addDimmerElement(object);
    }
    else if (object['SwitchType'] == 'Blinds'){
        addBlindElement(object);
    }
    else if (object['SwitchType'] == 'Motion Sensor'){
        addMotionSensor(object);
    }
    else if (object['SwitchType'] == 'Selector'){
        addSelectorElement(object);
    }
    else if (object['Type']){
        if (object['Type'].startsWith('Temp'))
        addTemperatureElement(object);
    }
    else{
        console.log(object);
    }
}

function elementUpdater(object){
    if (object['SwitchType'] == 'On/Off'){
        updateLightElement(object);
    }
    else if (object['SwitchType'] == 'Dimmer'){
        updateDimmerElement(object);
    }
    else if (object['SwitchType'] == 'Blinds'){
        updateBlindElement(object);
    }
    else if (object['SwitchType'] == 'Motion Sensor'){
        updateMotionSensor(object);
    }
    else if (object['Type']){
        if (object['Type'].startsWith('Temp'))
        updateTemperatureElement(object);
    }
}

function moveButton(){
    if (movingState) disableMoving();
    else enableMoving();
    window.socket.emit('changeMovingMode', {"value": movingState})
}

function connectionButton(){
    console.log("connection button!")
}

function settingsButton() {
    console.log("settings button!")
}

function getStatusOfAll() {
    window.socket.emit('getStatusOfFavoriteDevicesLight')
    window.socket.emit('getStatusOfFavoriteDevicesTemp')
}

function sendOrder(order){
    window.socket.emit('widgetOrder', order)
}

function updateClock(){
    let days = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
    let date = new Date();
    let timeClock = date.getHours() + ":" + date.getMinutes();
    let timeSecondsClock = date.getSeconds();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    if (day < 10) day = "0" + day;
    if (month < 10) month = "0" + month;
    if (timeSecondsClock < 10) timeSecondsClock = "0" + timeSecondsClock;
    let dateClock = day + "." + month + "." + date.getFullYear();
    let dayClock = days[date.getDay()];
    $("#timeClock").html(timeClock);
    $("#timeSecondsClock").html(timeSecondsClock);
    $('#dateClock').html(dateClock);
    $('#dayClock').html(dayClock);
}

$(document).ready(function () {
    $('#sensorRow').gridstrap({rearrangeOnDrag: false, swapMode: false, draggable : true, ragMouseoverThrottle: 20});
    $('#switchRow').gridstrap({rearrangeOnDrag: false, swapMode: false, draggable : true, ragMouseoverThrottle: 20});
    namespace = '/desktop'
    window.socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port + namespace, {
        reconnection: false
    });

    window.socket.on('getLightDevice', function (msg) {
        var data = eval('(' + msg.data + ')');
        var order = msg['order']
        order.forEach(function (idx){
            data.forEach(function (element){
                if (idx == parseInt(element['idx'])){
                    elementCreator(element)
                }
            });
        });
    });

    window.socket.on('getTempDevice', function (msg) {
        var data = eval('(' + msg.data + ')');
        var order = msg['order']
        order.forEach(function (idx){
            data.forEach(function (element){
                if (idx == parseInt(element['idx'])){
                    elementCreator(element)
                }
            });
        });
    });

    window.socket.on('updateLightDevice', function (msg) {
        var data = eval('(' + msg.data + ')');
        data.forEach(elementUpdater);
    });

    window.socket.on('updateTempDevice', function (msg) {
        var data = eval('(' + msg.data + ')');
        data.forEach(elementUpdater);
    });

    setInterval(function () {
        window.socket.emit('updateStatusOfFavoriteDevicesLight')
    }, 3000);

    setInterval(function () {
        window.socket.emit('updateStatusOfFavoriteDevicesTemp')
    }, 5000);

    setInterval(function () {
        updateClock()
    }, 1000);

    getStatusOfAll();

    $(document).on('input', '#slider', function() {
        console.log( $(this).val() );
    });
});