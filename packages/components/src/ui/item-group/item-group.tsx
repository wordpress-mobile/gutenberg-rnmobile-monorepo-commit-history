/**
 * External dependencies
 */
import type { ViewOwnProps } from '@wp-g2/create-styles';
import { contextConnect } from '@wp-g2/context';

/**
 * Internal dependencies
 */
import { useItemGroup } from './use-item-group';
// eslint-disable-next-line no-duplicate-imports
import type { Props } from './use-item-group';
import { ItemGroupContext, useItemGroupContext } from './context';
import { View } from '../view';

function ItemGroup( props: ViewOwnProps< Props, 'div' > ) {
	const { size: sizeProp, ...otherProps } = useItemGroup( props );

	const { size: contextSize } = useItemGroupContext();

	const size = sizeProp || contextSize;

	return (
		<ItemGroupContext.Provider value={ { size } }>
			<View { ...otherProps } />
		</ItemGroupContext.Provider>
	);
}

export default contextConnect( ItemGroup, 'ItemGroup' );