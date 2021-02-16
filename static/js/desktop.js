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
        if (object['Type'].startsWith('Temp')){
            addTemperatureElement(object);
        }
        else if (object['Type'].startsWith('Scene')){
            addSceneElement(object);
        }
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
    else if (object['SwitchType'] == 'Selector'){
        updateSelectorElement(object);
    }
    else if (object['Type']){
        if (object['Type'].startsWith('Temp')){
            updateTemperatureElement(object);
        }
        else if (object['Type'].startsWith('Scene')){
            updateSceneElement(object);
        }
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
    window.location.replace(location.protocol + '//' + document.domain + ':' + location.port + '/settings')
}

function getStatusOfAll() {
    window.socket.emit('getStatusOfFavoriteDevicesLight')
    window.socket.emit('getStatusOfFavoriteDevicesTemp')
    window.socket.emit('getFavoriteScenes')
}

function sendOrder(order){
    window.socket.emit('widgetOrder', order)
}

function updateClock(){
    let days = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let timeSecondsClock = date.getSeconds();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (day < 10) day = "0" + day;
    if (month < 10) month = "0" + month;
    if (timeSecondsClock < 10) timeSecondsClock = "0" + timeSecondsClock;
    let timeClock = hours + ":" + minutes;
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
    $('#sceneRow').gridstrap({rearrangeOnDrag: false, swapMode: false, draggable : true, ragMouseoverThrottle: 20});
    namespace = '/desktop'
    window.socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port + namespace, {
        reconnection: true
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

    window.socket.on('getFavoriteScenes', function (msg) {
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

    window.socket.on('updateScenes', function (msg) {
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
        window.socket.emit('updateFavoriteScenes')
    }, 5000);

    setInterval(function () {
        updateClock()
    }, 1000);

    getStatusOfAll();

    $(document).on('input', '#slider', function() {
        console.log( $(this).val() );
    });
});