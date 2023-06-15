export const getFocusKeywords = async (
	setData,
	setError,
	setLoading,
	setAnalyzeButtonText,
	analyzeButtonText,
	setAnalyzeButtonDisabled,
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
		.then( ( response ) => response.json() )
		.then( ( result ) => {
			setData( result.data.responses.seo_get_focus_keywords.data.keywords );
			if ( 'ANALYZE' === analyzeButtonText ) {
				setAnalyzeButtonText( 'RE-ANALYZE' );
			}
			setAnalyzeButtonDisabled( false );
		} )
		.catch( ( e ) => {
			setError( e.message );
		} )
		.finally( () => {
			setLoading( false );
		} );
};

export const fetchKeyWordsAnalyzeData = async (
	suggestion,
	setSuggestionsStructure,
	setError,
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
	urlencoded.append( 'actions', JSON.stringify( suggestion.actions ) );

	var requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: urlencoded,
		redirect: 'follow',
	};
	let data = null;
	await fetch( elementorCommonConfig.ajax.url, requestOptions )
		.then( ( response ) => response.text() )
		.then( ( result ) => {
			data = JSON.parse( result );
			const suggestionObject = {
				action: suggestion.action,
				loaded: false,
				isPass: data.data.responses[ suggestion.action ].data.pass,
				suggestion: data.data.responses[ suggestion.action ].data.suggestion,
				message: data.data.responses[ suggestion.action ].data.message,
				actions: suggestion.actions,
			};
			setSuggestionsStructure( suggestionObject );
		} )
		.catch( ( e ) => {
			setError( e.message );
		} )
		.finally( () => {
			return data;
		} );
};
