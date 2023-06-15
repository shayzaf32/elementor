import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Divider from '@mui/material/Divider';
import { Skeleton } from '@elementor/ui';

export default function InsetDividers( { suggestionsKeywordStructure } ) {
	return (
		<List
			sx={ {
				width: '100%',
				maxWidth: 360,
				bgcolor: 'background.paper',
			} }
		>
			{ suggestionsKeywordStructure.loading ? (
				<>
					<Skeleton />
					<Skeleton animation="wave" />
					<Skeleton animation={ false } />
				</>
			) : (
				<>
					<ListItem>
						<ListItemAvatar>
							<Avatar sx={ {
								bgcolor: 'transparent',
							} }>
								{
									suggestionsKeywordStructure.isPass ? ( <CheckCircleOutlineIcon color="success" /> ) : ( <ErrorOutlineIcon color="warning" /> )
								}
							</Avatar>
						</ListItemAvatar>
						<ListItemText primary={ suggestionsKeywordStructure.message } secondary={ suggestionsKeywordStructure.isPass ? '' : 'Suggestion: ' + suggestionsKeywordStructure.suggestion } />
					</ListItem>
				</>
			)
			}
			<Divider variant="inset" component="li" />
		</List>
	);
}
