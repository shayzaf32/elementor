import { useState } from 'react';
import { IMAGE_PROMPT_SETTINGS } from '../pages/form-media/consts/consts';

const useImagePromptSettings = ( {
	style = '',
	type = '',
	imageWeight = 0,
	aspectRatio = '1:1',
	zoom = '1',
	upScaleTo = '512',
} = {} ) => {
	const [ promptSettings, setPromptSettings ] = useState( {
		[ IMAGE_PROMPT_SETTINGS.IMAGE_TYPE ]: style,
		[ IMAGE_PROMPT_SETTINGS.STYLE_PRESET ]: type,
		[ IMAGE_PROMPT_SETTINGS.IMAGE_STRENGTH ]: imageWeight,
		[ IMAGE_PROMPT_SETTINGS.ASPECT_RATIO ]: aspectRatio,
		[ IMAGE_PROMPT_SETTINGS.ZOOM ]: zoom,
		[ IMAGE_PROMPT_SETTINGS.UPSCALE_TO ]: upScaleTo,
	} );

	const updatePromptSettings = ( newSettings ) => {
		setPromptSettings( {
			...promptSettings,
			...newSettings,
		} );
	};

	const resetPromptSettings = () => {
		setPromptSettings( {
			[ IMAGE_PROMPT_SETTINGS.IMAGE_TYPE ]: style,
			[ IMAGE_PROMPT_SETTINGS.STYLE_PRESET ]: '',
			[ IMAGE_PROMPT_SETTINGS.IMAGE_STRENGTH ]: 0,
			[ IMAGE_PROMPT_SETTINGS.ASPECT_RATIO ]: '1:1',
			[ IMAGE_PROMPT_SETTINGS.ZOOM ]: '1',
			[ IMAGE_PROMPT_SETTINGS.UPSCALE_TO ]: '512',
		} );
	};

	return {
		promptSettings,
		updatePromptSettings,
		setPromptSettings,
		resetPromptSettings,
	};
};

export default useImagePromptSettings;
