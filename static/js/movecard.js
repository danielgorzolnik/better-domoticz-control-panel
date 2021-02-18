var movingState = false;
var test;

function enableMoving(){
    movingState = true
    $( ".card" ).each(function( index ) {
        if ($(this).hasClass("no_move")){
        }
        else
        {   
            if ($(this).parent().parent().attr("id") == "switchRow"){
                $('#switchRow').data('gridstrap').attachCell($(this).parent())
            }
            else if ($(this).parent().parent().attr("id") == "sensorRow"){
                $('#sensorRow').data('gridstrap').attachCell(($(this).parent()))
            }
            else if ($(this).parent().parent().attr("id") == "sceneRow"){
                $('#sceneRow').data('gridstrap').attachCell(($(this).parent()))
            }
            else if ($(this).parent().parent().attr("id") == "weatherRow"){
                $('#weatherRow').data('gridstrap').attachCell(($(this).parent()))
            }
            this.classList.add("pulsegreen");
        }
    });
}

function disableMoving(){
    sendOrder(getOrderId());
    movingState = false;
    $('#sensorRow').data('gridstrap').$getCells().each(function(index) {
        $('#sensorRow').data('gridstrap').removeCell($(this))
    });
    $('#switchRow').data('gridstrap').$getCells().each(function(index) {
        $('#switchRow').data('gridstrap').removeCell($(this))
    });
    $('#sceneRow').data('gridstrap').$getCells().each(function(index) {
        $('#sceneRow').data('gridstrap').removeCell($(this))
    });
    $('#weatherRow').data('gridstrap').$getCells().each(function(index) {
        $('#sceneRow').data('gridstrap').removeCell($(this))
    });
    getStatusOfAll();
}

function getOrderId() {
    var order = {'sensorRow': [], 'switchRow': [], 'sceneRow': []};
    $('#sensorRow').data('gridstrap').$getCells().each(function( index ) {
        order['sensorRow'].push($($(this)[0].innerHTML).attr("id"))
    });
    $('#switchRow').data('gridstrap').$getCells().each(function( index ) {
        order['switchRow'].push($($(this)[0].innerHTML).attr("id"))
    });
    $('#sceneRow').data('gridstrap').$getCells().each(function( index ) {
        order['sceneRow'].push($($(this)[0].innerHTML).attr("id").split("scene")[1])
    });
    $('#weatherRow').data('gridstrap').$getCells().each(function( index ) {
        order['weatherRow'].push($($(this)[0].innerHTML).attr("id").split("scene")[1])
    });
    return order
}