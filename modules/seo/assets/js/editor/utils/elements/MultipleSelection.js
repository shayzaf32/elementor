import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

function getStyles( name, personName, theme ) {
	return {
		fontWeight:
			-1 === personName.indexOf( name )
				? theme.typography.fontWeightRegular
				: theme.typography.fontWeightMedium,
	};
}

// eslint-disable-next-line react/prop-types
const MultipleSelect = ( { keyWords, setSelectValueChanged, setSelectValue } ) => {
	if ( ! keyWords || ! keyWords.data ) {
		return ( '' );
	}
	keyWords = keyWords.data.keywords;

	const theme = useTheme();
	const [ keyWordValue, setKeyword ] = React.useState( [] );

	const handleChange = ( event ) => {
		const {
			target: { value },
		} = event;
		setKeyword(
			// On autofill we get a stringified value.
			'string' === typeof value ? value.split( ',' ) : value,
		);
		setSelectValueChanged( true );
		setSelectValue( keyWordValue );
	};

	return (
		<div>
			<FormControl sx={ { m: 1, width: 300 } }>
				<InputLabel id="demo-multiple-chip-label">Focus Keywords</InputLabel>
				<Select
					labelId="demo-multiple-chip-label"
					id="demo-multiple-chip"
					value={ keyWordValue }
					onChange={ handleChange }
					input={ <OutlinedInput id="select-multiple-chip" label="Focus Keywords" /> }
					renderValue={ ( selected ) => (
						<Box sx={ { display: 'flex', flexWrap: 'wrap', gap: 0.5 } }>
							{ selected.map( ( value ) => (
								<Chip key={ value } label={ value } />
							) ) }
						</Box>
					) }
					MenuProps={ MenuProps }
				>
					{ keyWords.map( ( keyWord ) => (
						<MenuItem
							key={ keyWord }
							value={ keyWord }
							style={ getStyles( keyWord, keyWordValue, theme ) }
						>
							{ keyWord }
						</MenuItem>
					) ) }
				</Select>
			</FormControl>
		</div>
	);
};

export default MultipleSelect;
