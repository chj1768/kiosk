
class Kiosk {

  constructor( isOrdering ) {

    this.tempCash = isOrdering ? parseInt( localStorage.getItem( "tempCash" ) ) : 0;
    this.orderList = isOrdering ? new Map( JSON.parse( localStorage.getItem( "orderList" ) ) ) : new Map();
    this.cash = isOrdering ? parseInt( localStorage.getItem( "cash" ) ) : 0;
    this.myWallet = isOrdering ? parseInt( localStorage.getItem( "myWallet" ) ) : 20000;

    document.getElementById( 'wallet' ).value = this.cash;
    this.randomizeMenu( isOrdering );
    this.updateMenu();
    this.renderScreen();
    document.getElementById( 'reset_button' ).onclick = this.removeMenu;
    
    document.getElementById( 'order_button' ).onclick = this.orderMenu;
    [ ...document.getElementsByClassName( 'cash' ) ].forEach( cashButton => { 
        cashButton.addEventListener( 'click', 
          e => {
            if( cashButton.value <= this.myWallet ) {
              this.addCash( parseInt( cashButton.value ) );
            }
            else {
              alert('돈이 없네~~~~ ㅠㅠ');
            }
          } 
        );
    });

  }

  addMenu( name, price ) {

    if( price > this.tempCash ) {
        this.updateMenu();
        return;
    }

  	if( this.orderList.has( name ) ) {
  		const prevNum = this.orderList.get( name );
  		this.orderList.set( name, prevNum + 1 );
  	}
  	else {
		  this.orderList.set( name, 1 );
  	}
  	this.tempCash -= price;
    this.renderScreen();
    this.updateMenu();

  }

  minusMenu( name, price ) {

    if( this.orderList.get( name ) > 1 ) {
      const prevNum = this.orderList.get( name );
      this.orderList.set( name, prevNum - 1 );
    }
    else {
      this.orderList.delete( name );
    }
    this.orderList.size < 1 && localStorage.removeItem( "orderList" );
    this.tempCash += parseInt( price );
    this.renderScreen();
    this.updateMenu();

  }


  removeMenu() {

  	this.orderList.clear();
    localStorage.removeItem( 'orderList' );
    this.removeOrderList();
    this.myWallet += this.cash;
    document.getElementById( 'wallet' ).value = 0;
    this.tempCash = 0;
    this.cash = 0;
    this.updateMenu();

  }

  orderMenu() {

    if( this.orderList.size < 1 ) {
        alert('주문할 내역이 없습니다.');
        return;
    }
    this.myWallet += this.tempCash;
    document.getElementById( 'wallet' ).value = 0;
    this.cash = 0;
    this.tempCash = 0;
    this.orderList.clear();
    localStorage.removeItem( 'orderList' );
    this.removeOrderList();
    this.updateMenu();
    alert('주문이 완료되었습니다. 남은 돈은 반환됩니다.');

  }


  addCash( cash ) {

    this.tempCash += cash;
    this.cash += cash;
    this.myWallet -= cash;
    document.getElementById('wallet').value = parseInt( this.cash );
  	this.updateMenu();

  }

  removeOrderList() {

    const screen = document.getElementById( 'order_screen' );
    while ( screen.hasChildNodes() ) 
      screen.removeChild( screen.firstChild ); 


  }

  renderScreen() {

      this.removeOrderList();
      this.orderList.size >= 1 && localStorage.setItem( "orderList", JSON.stringify( Array.from( this.orderList.entries() ) ) );
      this.orderList.forEach(
          (value, key, map) => {
            const orderItem = document.createElement( 'div' );
            orderItem.innerHTML = `메뉴 : ${key} / 수량 : ${value} `;
            orderItem.className = "orderItem";
            const addOrder = document.createElement( 'span' );
            addOrder.innerHTML = "+";
            addOrder.className = "modifyOrder";
            addOrder.onclick = this.addMenu.bind( this, key, String( key ).match( /[0-9]\d*/)[ 0 ] );
            const removeOrder = document.createElement( 'span' );
            removeOrder.innerHTML = "-";
            removeOrder.className = "modifyOrder";
            removeOrder.onclick = this.minusMenu.bind( this, key, String( key ).match( /[0-9]\d*/ )[ 0 ] );
            orderItem.appendChild( addOrder );
            orderItem.appendChild( removeOrder );
            document.getElementById( 'order_screen' ).appendChild( orderItem );
          }
      );

  }

  randomizeMenu( isOrdering ) {

  	const menuList = document.getElementsByClassName( 'menu' );
		const num = isOrdering ? parseInt( localStorage.getItem( "soldoutMenu1" ) ) : Math.floor( Math.random() * menuList.length );
		let num2 = isOrdering ? parseInt( localStorage.getItem( "soldoutMenu2" ) ) : -1;
		while( !isOrdering ) {
			num2 = Math.floor( Math.random() * menuList.length ); 
			if( num !== num2 ) break;
		}
    menuList[ num ].className = 'soldout menu';
    menuList[ num2 ].className = 'soldout menu';

    localStorage.setItem( "soldoutMenu1", num );
    localStorage.setItem( "soldoutMenu2", num2 );

  }


  updateMenu() {

      localStorage.setItem( "tempCash", this.tempCash );
      localStorage.setItem( "cash", this.cash );
      localStorage.setItem( "myWallet", this.myWallet );
      localStorage.setItem( "isOrdering", ( this.cash !== 0 || this.orderList.size >= 1 ) ? true : false );

      [ ...document.getElementsByClassName( 'menu' ) ].forEach( item => {
  			if( !item.className.includes( 'soldout' ) &&  item.value <= this.tempCash ) {
  				item.style.color = 'black';
          item.style.cursor = 'pointer';
  				item.onclick = this.addMenu.bind( this, item.textContent, item.value );
  			}
  			else if ( !item.className.includes( 'soldout' ) && item.value > this.tempCash ) {
  				item.style.color = '#ddd';
          item.style.cursor = 'not-allowed';
  			}
  		});


	}


}


export default Kiosk;