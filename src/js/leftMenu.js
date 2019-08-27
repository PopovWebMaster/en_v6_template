import $ from "jquery";


let menu = $("nav#nav_main");
let isBadClick = false;

$( menu ).css({"left": -getParam().menuWidth , "opacity": "0"}); // при загрузке устанавливает мену в нужное положение




/*
$("#menu_logo").on("click", this.toggle_open_status_menu);
$("main").on("click", this.toggle_open_status_menu);
$("#nav_close_wrp").on("click", this.toggle_open_status_menu);
$(".itemMenu").on("click", this.toggle_open_status_menu);
*/


$("#menu_logo").on('click', function(){

    if( !isBadClick ){
        isBadClick = true;
        openCloseMenu( getParam() );
        console.dir( getParam() );

        setTimeout( function(){
            
            isBadClick = false;

        }, 500 );
 
    };

    
});

$("main").on('click', function(){
    
    console.dir( isBadClick );
    if( !isBadClick ){

        isBadClick = true;
        openCloseMenu( getParam() );
        console.dir( getParam() );

        setTimeout( function(){
            
            isBadClick = false;
            console.dir( isBadClick );
        }, 500 );

        
 
    };
});





function openCloseMenu( param ){

    let speed_animate_menu = 300;

    let newParam = {
        newLeft: '',
        newOpacity: ''
    };

    let setNewOpacity;

    if( param.isOpen ){
        newParam.newLeft = -param.menuWidth
        newParam.newOpacity = 0;
        setNewOpacity = function(){

            let timer = setTimeout( function(){
                $( menu ).css("opacity", newParam.newOpacity);
            }, speed_animate_menu );
            clearTimeout(timer);

        };

    }else{
        newParam.newLeft = 0
        newParam.newOpacity = 1;
        $( menu ).css("opacity", newParam.newOpacity);
        setNewOpacity = function(){
            
        };
    };

    $( menu ).animate(
        { 
            left: newParam.newLeft
        }, 
        speed_animate_menu, 
        "swing", 
        setNewOpacity
    );

};










function getParam(){
    let res = {
        menuWidth: '',
        positionLeft: '',
        isOpen: false
    };

    res.menuWidth = $( menu ).innerWidth();
    res.positionLeft = $( menu ).position().left;

    if( res.positionLeft !== 0 ){
        res.isOpen = false;
    }else{
        res.isOpen = true;
    };
    return res;

};

console.dir( getParam() );









