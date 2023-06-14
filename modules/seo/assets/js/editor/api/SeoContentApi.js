
export const getFocusKeywords = async (
	actionAjax,
	setData,
	setError,
	setLoading,
	setAnalyzeButtonText,
) => {
	var myHeaders = new Headers();
	myHeaders.append( 'Accept', 'application/json, text/javascript, */*; q=0.01' );
	myHeaders.append( 'Connection', 'keep-alive' );
	myHeaders.append( 'Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8' );
	var urlencoded = new URLSearchParams();
	urlencoded.append( 'action', 'elementor_ajax' );
	urlencoded.append( '_nonce', elementorCommonConfig.ajax.nonce );
	urlencoded.append( 'initial_document_id', elementor.config.document.id );
	urlencoded.append( 'editor_post_id', elementor.config.document.id );
	urlencoded.append( 'actions', '{"seo_get_focus_keywords":{"action":"seo_get_focus_keywords"}}' );

	var requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: urlencoded,
		redirect: 'follow',
	};

	await fetch( elementorCommonConfig.ajax.url, requestOptions )
		.then( ( response ) => {
			setData( response );
		} )
		.catch( ( e ) => {
			setError( e.message );
		} )
		.finally( () => {
			setLoading( false );
			setAnalyzeButtonText( 'RE-ANALYZE' );
		} );
};
