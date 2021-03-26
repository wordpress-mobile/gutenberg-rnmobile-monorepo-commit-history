/**
 * External dependencies
 */
import { css } from '@emotion/core';
import styled from '@emotion/styled';

/**
 * @param {import('..').OwnProps} props
 */
const alignStyle = ( { align } ) => {
	if ( align === undefined ) return '';

	const aligns = {
		top: 'flex-start',
		bottom: 'flex-end',
	};

	const value = aligns[ /** @type {'top' | 'bottom'} */ ( align ) ] || align;

	return css( {
		alignItems: value,
	} );
};

/**
 * @param {import('..').OwnProps} props
 */
const justifyStyle = ( { justify, isReversed } ) => {
	const justifies = {
		left: 'flex-start',
		right: 'flex-end',
	};
	let value =
		justifies[ /** @type {'left' | 'right'} */ ( justify ) ] || justify;

	if (
		isReversed &&
		justifies[ /** @type {'left' | 'right'} */ ( justify ) ]
	) {
		value = justify === 'left' ? justifies.right : justifies.left;
	}

	return css( {
		justifyContent: value,
	} );
};

/**
 * @param {import('..').OwnProps} Props
 */
const gapStyle = ( { gap, isReversed, direction } ) => {
	const isVertical = direction === 'column';
	const base = 4;
	const value = typeof gap === 'number' ? base * gap : base;
	let dir = isReversed ? 'left' : 'right';
	if ( isVertical ) {
		dir = isReversed ? 'top' : 'bottom';
	}
	const margin = `margin-${ dir }`;

	return css`
		> * {
			${ margin }: ${ value }px;

			&:last-child {
				${ margin }: 0;
			}
		}
	`;
};

/**
 * @param {import('..').OwnProps} props
 */
const directionStyles = ( { direction, isReversed } ) => {
	const directionValue = isReversed ? `${ direction }-reverse` : direction;

	return css`
		flex-direction: ${ directionValue };
	`;
};

export const Flex = styled.div`
	box-sizing: border-box;
	display: flex;
	width: 100%;

	${ alignStyle }
	${ justifyStyle }
	${ directionStyles }
	${ gapStyle }
`;

export const Item = styled.div`
	box-sizing: border-box;
	min-width: 0;
	max-width: 100%;
`;

export const Block = styled( Item )`
	flex: 1;
`;
