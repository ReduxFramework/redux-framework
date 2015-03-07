/*
 Field Link Color
 */

/*global jQuery, document, redux_change, redux*/

(function( $ ) {
    'use strict';

    redux.field_objects = redux.field_objects || {};
    redux.field_objects.link_color = redux.field_objects.link_color || {};

    $( document ).ready(
        function() {

        }
    );

    // Set the color to the linked one
    $( document ).find( '.redux-group-tab' ).find( '.redux-container-link_color' ).each(
        function() {
            $(this).on(
                'redux/linked/color', function( event, index, value, colorNew ) {
                    var regular = ( value.regular !== undefined && value.regular !== true ) ? value.regular : colorNew;
                    var hover = ( value.hover !== undefined && value.hover !== true ) ? value.hover : colorNew;
                    var visited = ( value.visited !== undefined && value.visited !== true ) ? value.visited : colorNew;
                    var active = ( value.active !== undefined && value.active !== true ) ? value.active : colorNew;

                    try {
                        $(this).find( '.redux-color-regular' ).wpColorPicker('color', regular);
                        $(this).find( '.redux-color-hover' ).wpColorPicker('color', hover);
                        $(this).find( '.redux-color-visited' ).wpColorPicker('color', visited);
                        $(this).find( '.redux-color-active' ).wpColorPicker('color', active);
                    }
                    catch(e) {
                        $(this).find( '.redux-color-regular' ).val(regular);
                        $(this).find( '.redux-color-hover' ).val(hover);
                        $(this).find( '.redux-color-visited' ).val(visited);
                        $(this).find( '.redux-color-active' ).val(active);
                    }
                }
            );
        }
    );

    redux.field_objects.link_color.init = function( selector ) {

        if ( !selector ) {
            selector = $( document ).find( '.redux-container-link_color:visible' );
        }

        $( selector ).each(
            function() {
                var el = $( this );
                var parent = el;
                
                if ( !el.hasClass( 'redux-field-container' ) ) {
                    parent = el.parents( '.redux-field-container:first' );
                }
                if ( parent.is( ":hidden" ) ) { // Skip hidden fields
                    return;
                }
                if ( parent.hasClass( 'redux-field-init' ) ) {
                    parent.removeClass( 'redux-field-init' );
                } else {
                    return;
                }
                
                el.find( '.redux-color-init' ).wpColorPicker({
                    change: function( u ) {
                        redux_change( $( this ) );
                        el.find( '#' + u.target.getAttribute( 'data-id' ) + '-transparency' ).removeAttr( 'checked' );
                    },
                    clear: function() {
                        redux_change( $( this ).parent().find( '.redux-color-init' ) );
                    }
                });

                el.find( '.redux-color' ).on(
                    'keyup', function() {
                        var value = $( this ).val();
                        var color = colorValidate( this );
                        var id = '#' + $( this ).attr( 'id' );

                        if ( value === "transparent" ) {
                            $( this ).parent().parent().find( '.wp-color-result' ).css(
                                'background-color', 'transparent'
                            );
                    
                            el.find( id + '-transparency' ).attr( 'checked', 'checked' );
                        } else {
                            el.find( id + '-transparency' ).removeAttr( 'checked' );

                            if ( color && color !== $( this ).val() ) {
                                $( this ).val( color );
                            }
                        }
                    }
                );

                // Replace and validate field on blur
                el.find( '.redux-color' ).on(
                    'blur', function() {
                        var value = $( this ).val();
                        var id = '#' + $( this ).attr( 'id' );

                        if ( value === "transparent" ) {
                            $( this ).parent().parent().find( '.wp-color-result' ).css(
                                'background-color', 'transparent'
                            );
                    
                            el.find( id + '-transparency' ).attr( 'checked', 'checked' );
                        } else {
                            if ( colorValidate( this ) === value ) {
                                if ( value.indexOf( "#" ) !== 0 ) {
                                    $( this ).val( $( this ).data( 'oldcolor' ) );
                                }
                            }

                            el.find( id + '-transparency' ).removeAttr( 'checked' );
                        }
                    }
                );

                // Store the old valid color on keydown
                el.find( '.redux-color' ).on(
                    'keydown', function() {
                        $( this ).data( 'oldkeypress', $( this ).val() );
                    }
                );
            }
        );
    };
})( jQuery );
