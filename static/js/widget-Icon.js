function setIconSetState(idx, name, state){
    setIcon(idx, name);
    setState(idx, name, state);
}

function setIcon(idx, name) {
    let classes;
    switch (name) {
        case 'Light': 
            classes = 'far fa-lightbulb fa-3x';
            break;
        case 'WallSocket': 
            classes = 'fa fa-plug fa-3x';
            break;
        case 'TV':
            classes = 'fas fa-tv fa-3x'
            break;
        case 'Blinds':
            classes = 'fas fa-align-justify fa-3x'
            break;
        case 'temperature':
            classes = 'fas fa-thermometer-half fa-3x'
            break
        case 'Motion Sensor':
            classes = 'fas fa-running fa-3x'
            break
        case 'Speaker':
            classes = 'fas fa-volume-up fa-3x'
            break
        case 'Amplifier':
            classes = 'fas fa-pager fa-3x';
            break;
        case 'Scene':
            classes = 'far fa-clone fa-3x';
            break;
        default:
            classes = 'far fa-question-circle fa-3x'
            break;
    }
    $('#icon' + idx.toString()).addClass(classes)
}

function setState(idx, name, state) {
    let classBase;
    switch (name) {
        case 'Light': 
            classBase = 'lamp';
            break;
        case 'WallSocket': 
            classBase = 'socket';
            break;
        case 'TV':
            classBase = 'tv'
            break;
        case 'Motion Sensors':
            classBase = 'motion'
            break;
        case 'Speaker':
            classBase = 'speaker'
            break;
        case 'Amplifier':
            classBase = 'amplifier'
            break;
        default:
            classBase = 'lamp'
            break;
    }
    let not_normal;
    let normal;
    if (state == 'Off') {
        normal = classBase + 'Off'
        not_normal = classBase + 'On'
    }
    else {
        normal = classBase + 'On'
        not_normal = classBase + 'Off'
    }
    $('#icon' + idx.toString()).addClass(normal)
    $('#icon' + idx.toString()).removeClass(not_normal)
}