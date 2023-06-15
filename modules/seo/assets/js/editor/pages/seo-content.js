import * as React from 'react';
import Button from '@elementor/ui/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Item from '../utils/item';
import { getFocusKeywords, fetchKeyWordsAnalyzeData } from '../api/SeoContentApi';
import MultipleSelect from '../utils/elements/MultipleSelection';
import InsetDividers from '../utils/elements/InsetDividers';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import WifiProtectedSetupIcon from '@mui/icons-material/WifiProtectedSetup';

const SeoContent = () => {
	const [ keywordsData, setKeywordsData ] = React.useState( null );
	const [ loading, setLoading ] = React.useState( false );
	const [ error, setError ] = React.useState( false );
	const [ analyzeButtonText, setAnalyzeButtonText ] = React.useState( 'ANALYZE' );
	const [ analyzeButtonDisabled, setAnalyzeButtonDisabled ] = React.useState( false );

	const [ selectValueChanged, setSelectValueChanged ] = React.useState( false );
	const [ selectValue, setSelectValue ] = React.useState( null );
	const [ suggestionsHeadingKeywordStructure, setSuggestionsHeadingKeywordStructure ] = React.useState(
		{
			action: 'seo_is_keyword_in_heading',
			loading: true,
			isPass: false,
			suggestion: '',
			message: '',
			actions: '{"seo_is_keyword_in_heading":{"action":"seo_is_keyword_in_heading"}}',
		},
	);

	const [ suggestionsPageTitleKeywordStructure, setSuggestionsPageTitleKeywordStructure ] = React.useState(
		{
			action: 'seo_is_keyword_in_title',
			loading: false,
			isPass: false,
			suggestion: '',
			message: '',
			actions: '{"seo_is_keyword_in_title":{"action":"seo_is_keyword_in_title"}}',
		},
	);

	const [ suggestionsUrlPageKeywordStructure, setSuggestionsUrlPageKeywordStructure ] = React.useState(
		{
			action: 'seo_is_keyword_in_url',
			loaded: false,
			isPass: false,
			message: '',
			actions: '{"seo_get_focus_keywords_in_url":{"action":"seo_get_focus_keywords_in_url"}}',
		},
	);

	const [ suggestionsSubheadingKeywordStructure, setSuggestionsSubheadingKeywordStructure ] = React.useState(
		{
			action: 'seo_is_keyword_in_subheadings',
			loaded: false,
			isPass: false,
			message: '',
			actions: '{"seo_is_keyword_in_subheadings":{"action":"seo_is_keyword_in_subheadings"}}',
		},
	);

	const [ suggestionsDescriptionKeywordStructure, setSuggestionsDescriptionKeywordStructure ] = React.useState(
		{
			action: 'seo_is_keyword_in_description',
			loaded: false,
			isPass: false,
			message: '',
			actions: '{"seo_is_keyword_in_description":{"action":"seo_is_keyword_in_description"}}',
		},
	);

	const analyzeHandleClick = () => {
		setAnalyzeButtonDisabled( true );
		setLoading( true );
	};

	const fetchData = () => {
		getFocusKeywords(
			setKeywordsData,
			setError,
			setLoading,
			setAnalyzeButtonText,
			analyzeButtonText,
			setAnalyzeButtonDisabled,
		);
	};

	const fetchAnalyzeCountKeywordsData = () => {
		fetchKeyWordsAnalyzeData(
			suggestionsHeadingKeywordStructure,
			setSuggestionsHeadingKeywordStructure,
			setError,
		);
	};

	const fetchAnalyzePageTitleKeywordsData = () => {
		fetchKeyWordsAnalyzeData(
			suggestionsPageTitleKeywordStructure,
			setSuggestionsPageTitleKeywordStructure,
			setError,
		);
	};

	const fetchAnalyzeUrlPageKeywordsData = () => {
		fetchKeyWordsAnalyzeData(
			suggestionsUrlPageKeywordStructure,
			setSuggestionsUrlPageKeywordStructure,
			setError,
		);
	};

	const fetchAnalyzeGeneralContentKeywordsData = () => {
		fetchKeyWordsAnalyzeData(
			suggestionsSubheadingKeywordStructure,
			setSuggestionsSubheadingKeywordStructure,
			setError,
		);
	};

	const fetchAnalyzeDescriptionKeywordsData = () => {
		fetchKeyWordsAnalyzeData(
			suggestionsDescriptionKeywordStructure,
			setSuggestionsDescriptionKeywordStructure,
			setError,
		);
	};

	// Fetch Data
	React.useEffect( () => {
		if ( loading ) {
			fetchData();
		}
	}, [ loading ] );

	// Fetch Data
	React.useEffect( () => {
		if ( selectValueChanged ) {
			suggestionsHeadingKeywordStructure.loading = true;
			suggestionsHeadingKeywordStructure.isPass = false;
			suggestionsHeadingKeywordStructure.actions = { seo_is_keyword_in_heading: { action: 'seo_is_keyword_in_heading', data: { keyword: selectValue } } };

			suggestionsPageTitleKeywordStructure.loading = true;
			suggestionsPageTitleKeywordStructure.isPass = false;
			suggestionsPageTitleKeywordStructure.actions = { seo_is_keyword_in_title: { action: 'seo_is_keyword_in_title', data: { keyword: selectValue } } };

			suggestionsUrlPageKeywordStructure.loading = true;
			suggestionsUrlPageKeywordStructure.isPass = false;
			suggestionsUrlPageKeywordStructure.actions = { seo_is_keyword_in_url: { action: 'seo_is_keyword_in_url', data: { keyword: selectValue } } };

			suggestionsSubheadingKeywordStructure.loading = true;
			suggestionsSubheadingKeywordStructure.isPass = false;
			suggestionsSubheadingKeywordStructure.actions = { seo_is_keyword_in_subheadings: { action: 'seo_is_keyword_in_subheadings', data: { keyword: selectValue } } };

			suggestionsDescriptionKeywordStructure.loading = true;
			suggestionsDescriptionKeywordStructure.isPass = false;
			suggestionsDescriptionKeywordStructure.actions = { seo_is_keyword_in_description: { action: 'seo_is_keyword_in_description', data: { keyword: selectValue } } };

			fetchAnalyzeCountKeywordsData();
			fetchAnalyzePageTitleKeywordsData();
			fetchAnalyzeUrlPageKeywordsData();
			fetchAnalyzeGeneralContentKeywordsData();
			fetchAnalyzeDescriptionKeywordsData();
			setSelectValueChanged( false );
		}
	}, [ selectValueChanged ] );

	return (
		<Box sx={ { width: '100%' } }>
			<Stack spacing={ 2 }>
				<Item>
					<div>
						<div style={ { display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center' } }
						>
							<label >Analyze with AI</label> <Button variant="contained" onClick={ analyzeHandleClick } disabled={ analyzeButtonDisabled } sx={ { backgroundColor: '#F0ABFC', ':hover': {
								bgcolor: '#d004d4',
							} } } endIcon={ 'ANALYZE' === analyzeButtonText ? <AutoAwesomeIcon /> : <WifiProtectedSetupIcon /> }>{ analyzeButtonText }</Button></div>
						<br />
						<p style={ { textAlign: 'left' } }>Boost page performance and rankings with AI-powered insights and recommendations for improved SEO, accessibility, and performance.</p>
						<br />
						<MultipleSelect keyWords={ keywordsData } setSelectValueChanged={ setSelectValueChanged } setSelectValue={ setSelectValue } />
					</div>
					<div>
						{ selectValue &&
							 (
							 <>
								<InsetDividers suggestionsKeywordStructure={ suggestionsHeadingKeywordStructure } />
								<InsetDividers suggestionsKeywordStructure={ suggestionsPageTitleKeywordStructure } />
								<InsetDividers suggestionsKeywordStructure={ suggestionsUrlPageKeywordStructure } />
								<InsetDividers suggestionsKeywordStructure={ suggestionsSubheadingKeywordStructure } />
								<InsetDividers suggestionsKeywordStructure={ suggestionsDescriptionKeywordStructure } />
							 </>
							 )
						}
					</div>
					<br />
				</Item>
			</Stack>
		</Box>
	);
};

export default SeoContent;
