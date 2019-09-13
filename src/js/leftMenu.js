import $ from "jquery";



class LeftMenu {

    constructor() {
        this.SPEED_ANIMATE = 300;

        this.menu = $("nav#nav_main");
        this.isGoodClick = true;

        this.value_in_session = null;
        this.itemSessionIndex = 0; // имя для ячейки в сессии здесь хранится индекс клика если клик был не на главной странице

        this.stopBadClick = this.stopBadClick.bind(this);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.checkSession = this.checkSession.bind(this);
        this.scrollTo = this.scrollTo.bind(this);
        this.isHomePage = this.isHomePage.bind(this);
        this.processing_values_from_session_and_scroll = this.processing_values_from_session_and_scroll.bind(this);

        this.preparesMenuAtStart();
        this.runEvents();

        this.processing_values_from_session_and_scroll();

    }

    // ВОЗВРАЩАЕТ ОБЪЕКТ ТЕКУЩИХ ПАРАМЕТРОВ МЕНЮ
    
    getParam(){
        /* 
            {
                menuWidth: '',
                positionLeft: '',
                isOpen: false
            };
        
        */
        let res = {
            menuWidth: '',
            positionLeft: '',
            isOpen: false
        };
    
        res.menuWidth = $( this.menu ).innerWidth();
        res.positionLeft = $( this.menu ).position().left;
    
        if( res.positionLeft !== 0 ){
            res.isOpen = false;
        }else{
            res.isOpen = true;
        };
        return res;
    
    };

    // ОТКРЫВАЕТ МЕНЮ
    open(){
        if( this.getParam().isOpen ){ // защита от ошибки
            return;
        };

        $( this.menu ).css("opacity", "1");

        $( this.menu ).animate(
            { 
                left: 0
            }, 
            this.SPEED_ANIMATE, 
            "swing"
        );
    }

    // ЗАКРЫВАЕТ МЕНЮ
    close( func = undefined ){
        if( !this.getParam().isOpen ){ // защита от ошибки
            return;
        };

        $( this.menu ).animate(
            { 
                left:  -this.getParam().menuWidth
            }, 
            this.SPEED_ANIMATE, 
            "swing",
            function(){

                if( func !== undefined ){
                    func();
                };

                $( this.menu ).css("opacity", "0");
            }
        );
    }

    // НАСТРАИВАЕТ МЕНЮ ПЕРЕД НАЧАЛОМ РАБОТЫ КЛАССА
    preparesMenuAtStart(){
        // изначально предполагается что в файле css 
        /*
            nav#nav_main {
                ...
                left: -400px; <- случайное число
                opacity: 0;
            }
        */
        // при загрузке устанавливает меню в нужное положение
        // т ставит прозрачность в 0 (навсякий случай)
        $( this.menu ).css({"left": -this.getParam().menuWidth , "opacity": "0"});  

    }

    // ПОДКЛЮЧАЕТ СЛУШАТЕЛЕЙ СОБЫТИЙ
    runEvents(){

        // иконка меню
        $("#menu_logo").on("click", () => {
            this.stopBadClick( () => {
                if( this.getParam().isOpen ){

                    this.close();
                }else if( !this.getParam().isOpen ){

                    this.open();
                };

            });
        });

        // на любое место вне меню
        $("main").on("click", () => {
            this.stopBadClick( () => {
                if( this.getParam().isOpen ){
                    this.close();
                };
            });
        });

        // стрелка закрыть
        $("#nav_close_wrp").on("click", () => {
            this.stopBadClick( () => {
                this.close();
            });
        });

        // пункт меню
        $(".itemMenu").on("click", ( event ) => {
            this.stopBadClick( () => {
                this.close( () => {

                    let index = getIndexLi( event );

                    if( this.isHomePage() ){ // если во время клика мы находимся на главной странице
                        this.scrollTo( index );

                    }else{// если во время клика мы на любой другой странице
                        sessionStorage.setItem( this.itemSessionIndex, index );
                        document.location.href = '/';
                    };
                    
                    function getIndexLi( event ){
                        // её задача вычислить индекс кликнутого li 
                        let res = 0;
                        for( let i = 0; i < $('#ul_list li').length; i++ ){
                            if( $( '#ul_list li' ).eq( i ).hasClass( "itenMenuLi" ) ){
                               res = i;
                                break;
                            };
                        };
                        return $( event.currentTarget ).parent().index() - res;
                    };

                });
            });
        });

        // выбрать словарь
        $(".itemMenuButStart").on("click", ( event ) => {
            this.stopBadClick( () => {
                this.close( () => {
                    console.dir( event.currentTarget.id );
                    /*
                    
                        Здесь место для обраотки кликов по выбору словаря
                    
                    
                    */
                });
            });
        });
    }

    // БЛОКИРУЕТ ДУРНЫЕ КЛИКИ
    stopBadClick( func ){
        if( !this.isGoodClick ){
            return;
        };
        this.isGoodClick = false;
        func()
        setTimeout( ()=>{  
            this.isGoodClick = true;
        }, 500 );
    }

    checkSession(){

        let newItem = sessionStorage.getItem( this.itemSessionIndex );

        if( newItem ){ // не равно null, то есть чтото лежит в значении this.itemSessionIndex
            return true;
        }else{
            return false;
        };
    }

    processing_values_from_session_and_scroll(){
        // выполняет действие на старте, если клик на пункт меню был со страницы не главной
        // то она читает сессию и прокручивает страницу по данным из сессии
        if( this.checkSession() ){
            this.scrollTo( sessionStorage.getItem( this.itemSessionIndex ) );
            sessionStorage.removeItem( this.itemSessionIndex );
        };
    }
  
    isHomePage(){ // её задача вернуть true если мы находимся на главной и наоборот
        if( document.location.pathname === '/'){
            return true;
        }else{
            return false;
        };
    }



    scrollTo( index_itemMenu ){

        let currentTopPosition = $( window ).scrollTop();
        let arrArticlesTopPosition = getArticlesTopPosition();
        let spidScroll = false;

        //делает razn всегда положителным
        let razn =  arrArticlesTopPosition[ index_itemMenu ] - currentTopPosition;
        if(razn < 0){
            razn = razn * (-1);
        };

        //выбирает скорость
        if( razn <= 500 ){
            spidScroll = 500;
        }else if( razn <= 1500 ){
            spidScroll = 800;
        }else if( razn < 2500 ){
            spidScroll = 1100;
        }else if( razn >= 2500 ){
            spidScroll = 1400;
        };

        $('html, body').animate({scrollTop: arrArticlesTopPosition[ index_itemMenu ] }, spidScroll, "swing");

        function getArticlesTopPosition(){// Возвращает позиции всех <article> в виде массива
            let len = $('main section article').length;
            let res = [];
            let height_header = $( '#head_wrap' ).outerHeight();
  
            for( let i = 0; i < len; i++){
                let topPos = $( 'main section article' ).eq( i ).position().top;//position offset
                res.push( topPos - height_header );
            };
            return res;
        };
    }

};


let leftMenu = new LeftMenu();


