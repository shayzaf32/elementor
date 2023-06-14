import { render } from '@wordpress/element'

module.exports = Marionette.ItemView.extend( {
	template: '#tmpl-elementor-panel-seo',

	id: 'elementor-panel-seo',

	initialize() {
		elementor.getPanelView().getCurrentPageView().search.reset();
	},

	onShow() {
		console.log('SEO onShow')
		render(<div>test</div>, document.getElementById('seo-panel-content'));
	},
} );
