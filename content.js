import Kiosk from './kiosk.js';

window.addEventListener( 'DOMContentLoaded', e => {

			const isOrdering = localStorage.getItem( "isOrdering" ) ? localStorage.getItem( "isOrdering" ) : false;
		    const kiosk = new Kiosk( 'true' == isOrdering );
		  
});



