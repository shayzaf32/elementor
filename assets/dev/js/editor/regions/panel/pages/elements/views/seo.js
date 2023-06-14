import { render } from '@wordpress/element';
import App from '../../../../../../../../../modules/seo/assets/js/editor/app';

module.exports = Marionette.ItemView.extend( {
	template: '#tmpl-elementor-panel-seo',

	id: 'elementor-panel-seo',

	initialize() {
		elementor.getPanelView().getCurrentPageView().search.reset();
	},

	onShow() {
		render( <App />, document.getElementById( 'seo-panel-content' ) );
	},
} );
