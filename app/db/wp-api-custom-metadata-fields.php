<?php

/***
*
* Gathering a Building:
*
* Add helper to expose metadata fields requested by client.
* Used in wp-content/plugins/rest-api/plugin.php
*
***/

add_action( 'rest_api_init', 'slug_register_custom_field' );
function slug_register_custom_field() {

  // specify the fields that need to be added to API responses
  foreach( array(

    // routing
    'controller',

    // static site navigation assets
    'brandIcon', 'navigationButton',

    // text column
    'order', 'sectionType', 'template',

    // table of contents for material-journeys
    'introImage',

    // iframe embedding for material-journeys
    'iframe',

    // option to link objects to the landing page image
    'linksHome',

    // three-div-container fields
    'topImage', 'bottomImage', 'topCaption', 'bottomCaption',

    // youtube embed code for iframes
    'youtubeVideo',

    // landing page modal fields
    'xOffset', 'yOffset', 'destinationController', 'destinationId',

    // main site section fields
    'subtitle', 'order',

    // background images
    'backgroundImage', 'backgroundImageTop', 'backgroundImageBottom',

    // three picture template captions
    'topCaption', 'bottomCaption'

  ) as $field) {
    register_rest_field( 'post',
        $field,
        array(
            'get_callback'    => 'slug_get_custom_field',
            'update_callback' => null,
            'schema'          => null,
        )
    );
  }
}

/**
 * Get the value of the custom fields identified above
 *
 * @param array $object Details of current post.
 * @param string $field_name Name of field.
 * @param WP_REST_Request $request Current request
 *
 * @return mixed
 */
function slug_get_custom_field( $object, $field_name, $request ) {
    return get_post_meta( $object[ 'id' ], $field_name, true );
}

?>
