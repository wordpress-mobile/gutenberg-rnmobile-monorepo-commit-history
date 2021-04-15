/**
 * External dependencies
 */
import { uniq } from 'lodash';

/**
 * WordPress dependencies
 */
import { forwardRef, memo } from '@wordpress/element';
import warn from '@wordpress/warning';

/**
 * Internal dependencies
 */
import {
	getInterpolatedClassName,
	INTERPOLATION_CLASS_NAME,
} from '../create-styles';
import { CONNECT_STATIC_NAMESPACE } from './constants';

/* eslint-disable jsdoc/valid-types */
/**
 * Forwards ref (React.ForwardRef) and "Connects" (or registers) a component
 * within the Context system under a specified namespace.
 *
 * This is an (experimental) evolution of the initial connect() HOC.
 * The hope is that we can improve render performance by removing functional
 * component wrappers.
 *
 * @template {import('../create-styles').ViewOwnProps<{}, any>} P
 * @param {(props: P, ref: import('react').Ref<any>) => JSX.Element | null} Component The component to register into the Context system.
 * @param {Array<string>|string} namespace The namespace to register the component under.
 * @param {Object} options
 * @param {boolean} [options.memo=true]
 * @return {import('../create-styles').PolymorphicComponent<import('../create-styles').ElementTypeFromViewOwnProps<P>, import('../create-styles').PropsFromViewOwnProps<P>>} The connected PolymorphicComponent
 */
export function contextConnect( Component, namespace, options = {} ) {
	/* eslint-enable jsdoc/valid-types */
	const { memo: memoProp = true } = options;

	let WrappedComponent = forwardRef( Component );
	if ( memoProp ) {
		// @ts-ignore
		WrappedComponent = memo( WrappedComponent );
	}

	const displayName = Array.isArray( namespace )
		? namespace[ 0 ]
		: namespace || WrappedComponent.name;

	if ( typeof namespace === 'undefined' ) {
		warn( 'contextConnect: Please provide a namespace' );
	}

	// @ts-ignore internal property
	let mergedNamespace = WrappedComponent[ CONNECT_STATIC_NAMESPACE ] || [
		displayName,
	];

	/**
	 * Consolidate (merge) namespaces before attaching it to the WrappedComponent.
	 */
	if ( Array.isArray( namespace ) ) {
		mergedNamespace = [ ...mergedNamespace, ...namespace ];
	}
	if ( typeof namespace === 'string' ) {
		mergedNamespace = [ ...mergedNamespace, namespace ];
	}

	WrappedComponent.displayName = displayName;

	// @ts-ignore internal property
	WrappedComponent[ CONNECT_STATIC_NAMESPACE ] = uniq( mergedNamespace );

	// @ts-ignore internal property
	WrappedComponent[ INTERPOLATION_CLASS_NAME ] = getInterpolatedClassName(
		displayName
	);

	// @ts-ignore
	return WrappedComponent;
}

/**
 * Attempts to retrieve the connected namespace from a component.
 *
 * @param {import('react').ReactChild | undefined | {}} Component The component to retrieve a namespace from.
 * @return {Array<string>} The connected namespaces.
 */
export function getConnectNamespace( Component ) {
	if ( ! Component ) return [];

	let namespaces = [];

	// @ts-ignore internal property
	if ( Component[ CONNECT_STATIC_NAMESPACE ] ) {
		// @ts-ignore internal property
		namespaces = Component[ CONNECT_STATIC_NAMESPACE ];
	}

	// @ts-ignore
	if ( Component.type && Component.type[ CONNECT_STATIC_NAMESPACE ] ) {
		// @ts-ignore
		namespaces = Component.type[ CONNECT_STATIC_NAMESPACE ];
	}

	return namespaces;
}

/**
 * Checks to see if a component is connected within the Context system.
 *
 * @param {import('react').ReactNode} Component The component to retrieve a namespace from.
 * @param {Array<string>|string} match The namespace to check.
 * @return {boolean} The result.
 */
export function hasConnectNamespace( Component, match ) {
	if ( ! Component ) return false;

	if ( typeof match === 'string' ) {
		return getConnectNamespace( Component ).includes( match );
	}
	if ( Array.isArray( match ) ) {
		return match.some( ( result ) =>
			getConnectNamespace( Component ).includes( result )
		);
	}

	return false;
}

export const getNamespace = getConnectNamespace;
export const hasNamespace = hasConnectNamespace;
