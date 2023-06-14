import * as React from 'react';
import Button from '@elementor/ui/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Item from '../utils/item';
import { getFocusKeywords } from '../api/SeoContentApi';

const SeoContent = () => {
	const [ keywordsData, setKeywordsData ] = React.useState( false );
	const [ loading, setLoading ] = React.useState( false );
	const [ error, setError ] = React.useState( false );
	const [ analyzeButtonText, setAnalyzeButtonText ] = React.useState( 'ANALYZE' );
	const [ analyzeButtonDisabled, setAnalyzeButtonDisabled ] = React.useState( false );

	const analyzeHandleClick = () => {
		setAnalyzeButtonDisabled( true );
		setLoading( true );
		// TODO  fetch data and in success switch the text and set false to loading
		// TODO set false to loading
	};

	const fetchData = () => {
		getFocusKeywords(
			setKeywordsData,
			setError,
			setLoading,
			setAnalyzeButtonText,
		);
	};

	// Fetch Data
	React.useEffect( () => {
		if ( loading ) {
			fetchData();
		}
	}, [ loading ] );

	return (
		<Box sx={ { width: '100%' } }>
			<Stack spacing={ 2 }>
				<Item>
					<div>
						<label>Analyze with AI    <Button variant="contained" onClick={ analyzeHandleClick } disabled={ analyzeButtonDisabled } loading={ loading }>{ analyzeButtonText }</Button></label>
						<br />
						<p>Boost page performance and rankings with AI-powered insights and recommendations for improved SEO, accessibility, and performance.</p>
					</div>
				</Item>
				<Item>Item 2</Item>
				<Item>Item 3</Item>
			</Stack>
		</Box>
	);
};

export default SeoContent;
