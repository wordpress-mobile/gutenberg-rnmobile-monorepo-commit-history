/**
 * External dependencies
 */
import TextareaAutosize from 'react-autosize-textarea';

/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import {
	getBlockAttributes,
	getBlockContent,
	getBlockType,
	isValidBlockContent,
	getSaveContent,
	__unstableCodeHandler as codeHandler,
} from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import { store as blockEditorStore } from '../../store';

function BlockHTML( { clientId } ) {
	const [ html, setHtml ] = useState( '' );
	const block = useSelect(
		( select ) => select( blockEditorStore ).getBlock( clientId ),
		[ clientId ]
	);
	const { updateBlock } = useDispatch( blockEditorStore );
	const onChange = () => {
		const sanitizedHtml = codeHandler( { HTML: html, mode: 'INLINE' } );
		const blockType = getBlockType( block.name );
		const attributes = getBlockAttributes(
			blockType,
			sanitizedHtml,
			block.attributes
		);

		// If html is empty  we reset the block to the default HTML and mark it as valid to avoid triggering an error
		const content = sanitizedHtml
			? sanitizedHtml
			: getSaveContent( blockType, attributes );
		const isValid = sanitizedHtml
			? isValidBlockContent( blockType, attributes, content )
			: true;
		updateBlock( clientId, {
			attributes,
			originalContent: content,
			isValid,
		} );

		// Ensure the state is updated if we reset so it displays the default content
		if ( ! html ) {
			setHtml( { content } );
		}
	};

	useEffect( () => {
		setHtml( getBlockContent( block ) );
	}, [ block ] );

	return (
		<TextareaAutosize
			className="block-editor-block-list__block-html-textarea"
			value={ html }
			onBlur={ onChange }
			onChange={ ( event ) => setHtml( event.target.value ) }
		/>
	);
}

export default BlockHTML;
