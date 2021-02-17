//section for motion element

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
    if ($('#' + object['idx']).find('.date').children().html() != object['LastUpdate']) {
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
    if ($('#' + object['idx']).find('.date').children().html() != object['LastUpdate']) {
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
    if ($('#' + object['idx']).find('.date').children().html() != object['LastUpdate']) {
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
    if (parent.find('.date').children().html() != object['LastUpdate'])
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
    if ($('#' + object['idx']).find('.date').children().html() != object['LastUpdate']) {
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
    var template = $('#selectorTemplate').html();
    template = template.replace("tempName", object['Name'])
    template = template.replace("tempStatus", object["LevelNames"][object["Level"]])
    template = template.replace("tempDate", object['LastUpdate'])
    template = template.replace("tempIdx", object['idx'])
    template = template.replace("tempIconIdx", 'icon' + object['idx'])
    template = template.replace("tmpButtonText", object['LevelNames'][object['Level']])
    template = template.replace("tmpDropdownIdx", 'dropdown' + object['idx'])
    $('#switchRow').append(template);
    setIconSetState(object['idx'], object['Image'], object['Status'])
    fillSelectorElement(object['idx'], object['LevelNames'])
}

function fillSelectorElement(idx, levelNames){
    let myId = '#dropdown' + idx.toString();
    levelNames.forEach(function (levelName){
        $(myId).append('<a class="dropdown-item" style="width:100% !important;" onclick="clickSelectorElement(this, ' + idx.toString() + ", '" + levelName + "')" + '">' + levelName +'</a>');
    })
}

function clickSelectorElement(object, idx, levelName){
    window.socket.emit('clickSelector', {'idx': idx, 'level': levelName})
}

function updateSelectorElement(object){
    if ($('#' + object['idx']).find('.status').children().html() != object['LevelNames'][object['Level']]) {
        $('#' + object['idx']).find('.status').children().html(object['LevelNames'][object['Level']])
    }
    if ($('#' + object['idx']).find('.date').children().html() != object['LastUpdate']) {
        $('#' + object['idx']).find('.date').children().html(object['LastUpdate'])
        $('#' + object['idx']).find('.dropdown-toggle').html(object['LevelNames'][object['Level']])
    }
}

//------------------------------------------

//section for scene widget

function addSceneElement(object) {
    var template = $('#sceneTemplate').html();
    template = template.replace("tempName", object['Name'])
    template = template.replace("tempStatus", "Scena")
    template = template.replace("tempDate", object['LastUpdate'])
    template = template.replace("tempIdx", 'scene' + object['idx'])
    template = template.replace("tempIconIdx", 'iconscene' + object['idx'])
    $('#sceneRow').append(template);
    setIcon('scene' + object['idx'], object['Image'])
    $('#scene' + object['idx'].toString()).bind('click', function() {
        clickSceneElement($(this))
    });
}

function clickSceneElement(object){
    window.socket.emit('clickScene', {'idx': $(object).attr('id').split('scene')[1]})
}

function updateSceneElement(object){
    if ($('#scene' + object['idx']).find('.date').children().html() != object['LastUpdate']) {
        $('#scene' + object['idx']).find('.date').children().html(object['LastUpdate']);
    }
}

//------------------------------------------