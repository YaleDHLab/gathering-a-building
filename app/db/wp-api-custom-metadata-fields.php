<?php

/***
*
* Gathering a Building:
*
* Add helper to expose metadata fields requested by client
*
***/

add_action( 'rest_api_init', 'slug_register_custom_field' );
function slug_register_custom_field() {

  // specify the fields that need to be added to API responses
  foreach( array(
    // landing page modal fields
    'x', 'y', 'modal-image', 'modal-text', 'modal-title', 'link-destination',
    // main site section fields
    'subtitle', 'order',
    // background images
    'background-image', 'background-image-top', 'background-image-bottom',
    // three picture template captions
    'top-caption', 'bottom-caption') as $field) {
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
