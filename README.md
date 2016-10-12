[![Stories in Ready](https://badge.waffle.io/YaleDHLab/gathering-a-building.png?label=ready&title=Ready)](https://waffle.io/YaleDHLab/gathering-a-building)
[![Dependency Status](https://david-dm.org/YaleDHLab/gathering-a-building.svg)](https://david-dm.org/YaleDHLab/gathering-a-building)
[![devDependency Status](https://david-dm.org/YaleDHLab/gathering-a-building/dev-status.svg)](https://david-dm.org/YaleDHLab/gathering-a-building#info=devDependencies)

# Gathering a Building

This repository contains the source code for a web application that details aspects of Yale University's architecture. The application is built on an Angular 1 frontend that presents cartographic data from a CartoDB server and multimedia assets from a Wordpress API backend.

# Updating Post Content

Admin users can update data displayed on the site by visiting the site's [admin interface](http://ec2-54-190-9-54.us-west-2.compute.amazonaws.com/wordpress/wp-login.php/wordpress/wp-login.php). After logging in, users can establish the data to be displayed on the site by creating and editing posts using the following metadata fields:

### Required Metadata Fields

#### title  

<i>Default Field</i>

The title of each post is defined by the traditional Wordpress post title field ([example title field](./build/documentation_images/admin-title.png))

#### paragraphs 

<i>Default Field</i>
  
The text content for each post is defined by the traditional Wordpress text content field ([example paragraphs field](./build/documentation_images/admin-paragraphs.png)).

#### controller  

<i>Custom Field</i>

```
Accepted values:  
 * historical-geography
 * architecture-and-urbanism
 * material-journeys
 * people-and-places
```

The controller field within a post controls where that post will be displayed in the site navigation: i.e. whether the post will appear under www.mydomain.com/routes/historical-geography or www.mydomain.com/routes/people-and-places, or some other route on the site ([example controller field](./build/documentation_images/admin-controller.png)).

#### order 

<i>Custom Field</i>

```
Accepted values:  
 * An integer value between 0 and the number of posts for the given controller -1
```

The order field within a post controls where the post will be presented within a route, i.e. the order in which sections will appear within the text column as user's scroll through the content for a given route.

Given all of the posts that share a controller, one can set the order in which they will appear by giving the post that should appear first an order value of 0, the next post that should appear an order value of 1, and so on. Please note that duplicate order values are not accepted ([example order field](./build/documentation_images/admin-order.png)).

#### sectionType

<i>Custom Field</i>

```
Accepted values:  
 * table-of-contents
 * text
```

The sectionType field within a post indicates whether the given post represents the table of contents section for a particular controller or a text-based section for that controller. 

`table-of-contents`  
If a post's sectionType value is set to table-of-contents ([example table-of-contents field](./build/documentation_images/admin-section-type-table-of-contents.png)), the text column for that section will be represented as a series of links followed by a single paragraph introduction to the section ([example display](./build/documentation_images/material-journeys.png)). To create a table of contents, one should identify all of the posts for a given controller, then create one paragraph in the main Wordpress text box for each section within the controller that follows the table of contents ([example table-of-contents paragraphs content](./build/documentation_images/material-journeys-admin-text.png)).

`text`  
If a post's sectionType value is set to text ([example text field](./build/documentation_images/admin-section-type-text.png)), the text column for that section will be represented as a series of traditional paragraphs ([example display](./build/documentation_images/concrete.png)). To create a text post, one should simply enter paragraphs into the traditional Wordpress text field [example text paragraphs content](./build/documentation_images/concrete-admin-text.png)).

#### template

<i>Custom Field</i>

```
Accepted values:  
 * one-div-container
 * three-div-container
 * four-div-container
```

The template field within a post indicates the type of content to be displayed behind the text column. There are three options:

`one-div-container`  
If a post's template value is set to one-div-container, its background will be a full page background image ([example display](./build/documentation_images/concrete.png)). The background image is determined by the Featured Image for the given post ([example one-div-container field](./build/documentation_images/concrete-featured-image.png)).

`three-div-container`  
If a post's template value is set to three-div-container, its background will consist of three elements represented on the right hand side of the screen ([example display](./build/documentation_images/people-and-places.png)). The content within these elements is set by the following custom fields: `topImage`, `bottomImage`, `topCaption`, `bottomCaption`. Both the topImage and bottomImage fields are full paths to image files, while the topCaption and bottomCaption fields are plaintext caption fields. ([example three-div-container field](./build/documentation_images/admin-three-div-container.png))

`four-div-container`  
If a post's template value is set to four-div-container, its background will consist of four full height images that link to sections within the given controller ([example display](./build/documentation_images/material-journeys.png)). The background images for this background template are determined by the `introImage` field within posts for this controller. For instance, the example display linked earlier in this paragraph shows a page with four background images: concrete, stone, brick, and glass. The first of these images (concrete) is defined by the introImage value within the post that has an order value of 1 (as this is the first post to appear after the table of contents). Within the post with an order value of 1, the image to be represented in the four-div-container is specified in the introImage custom field ([example four-div-container field](./build/documentation_images/admin-four-div-container.png))

#### brandIcon

<i>Custom Field</i>

```
Accepted values:  
 * light
 * dark
```

`light`  
Setting the brandIcon value to light makes the site's brand icon (e.g. DHLab) appear white, which is recommended for pages with dark backgrounds ([example light brandIcon field](./build/documentation_images/admin-light-brand-icon.png)).

`dark`  
Setting the brandIcon value to dark makes the site's brand icon (e.g. DHLab) appear dark gray, which is recommended for pages with light backgrounds.

#### navigationButton

<i>Custom Field</i>

```
Accepted values:  
 * light
 * dark
```

`light`  
Setting the navigationButton value to light makes the site's navigation menu button  (i.e the "hamburger" icon) appear white, which is recommended for pages with dark backgrounds ([example light navigationButton field](./build/documentation_images/admin-light-navigation-button.png)).

`dark`  
Setting the navigationButton value to dark makes the site's navigation menu button  (i.e the "hamburger" icon) appear dark gray, which is recommended for pages with light backgrounds.


### Optional Metadata Fields

#### iframe

<i>Custom Field</i>

```
Accepted values:  
 * A fully-qualified url to an iframe
```

Posts with a controller value of material-journeys may use iframes to populate a full page representation of the iframed domain behind the text column ([example display](./build/documentation_images/iframe-display.png)). To do so, one need only set the value of iframe to the page you wish to display ([example iframe field](./build/documentation_images/admin-iframe.png)).


# Updating Home Page Icons

The site's home page consists of a series of icons that overlay a central image ([example home page icon](./build/documentation_images/home-icon-display.png)). The content within these icons and the position of these icons are determined by posts with the following metadata fields:

### Required Metadata Fields

#### title

<i>Default Field</i>

The title of each icon on the home page is defined by the traditional Wordpress post title field ([example title field](./build/documentation_images/home-icon-title.png)). Following the title with \&raquo; produces a nice visual display.

#### text

<i>Default Field</i>

The text content for home page icon is defined by the traditional Wordpress text content field ([example text field](./build/documentation_images/home-icon-text.png)).

#### controller

<i>Custom Field</i>

```
Accepted values:
 * home
```

Each icon on the home page must have its controller value set to home ([example controller field](./build/documentation_images/home-icon-controller.png)).

#### destinationController

<i>Custom Field</i>

```
Accepted values:
 * historical-geography
 * architecture-and-urbanism
 * material-journeys
 * people-and-places
```

Each destinationController value controls the route to which users should be directed when clicking the link within the given home icon. Setting a home icon's destinationController to material-journeys, for example, will ensure users are sent to the material-journeys route after clicking the home icon link ([example destinationController field](./build/documentation_images/home-icon-destinationController.png)).

#### destinationId

<i>Custom Field</i>

```
Accepted values:
 * An value between 0 and the number of posts for the given destinationController -1
```

The destinationId indicates the post within the destinationController to which users should be routed after clicking the link within the given home icon. Setting a home icon's destinationController to material-journeys and destinationId to 3, for instance, will ensure users who click the home icon's link are sent to the post assigned a controller value of material-journeys and an order value of 3 ([example destinationId field](./build/documentation_images/home-icon-destinationId.png)).

#### xOffset

<i>Custom Field</i>

```
Accepted values:
 * A decimal value between 0 and 1
```

A home icon's xOffset value indicates where the icon should be positioned over the home image on the x-axis. Setting this value to 0 will ensure the icon is positioned along the left-most edge of the image, setting the value to 1 will ensure the icon is posioned along the right-most edge of the image, and setting the value to a decimal between 0 and 1 will position the icon within the spectrum bounded by those two points ([example xOffset field](./build/documentation_images/home-icon-xOffset.png)).

#### yOffset

<i>Custom Field</i>

```
Accepted values:
 * A decimal value between 0 and 1
```

A home icon's yOffset value indicates where the icon should be positioned over the home image on the y-axis. Setting this value to 0 will ensure the icon is positioned along the top-most edge of the image, setting the value to 1 will ensure the icon is posioned along the bottom-most edge of the image, and setting the value to a decimal between 0 and 1 will position the icon within the spectrum bounded by those two points ([example yOffset field](./build/documentation_images/home-icon-yOffset.png)).


## Development Instance

A development instance of this repository may be found [here](http://ec2-54-190-9-54.us-west-2.compute.amazonaws.com).

## Developing

This application is built on a Node.js runtime, so one needs to have that installed to use this source code. To check if you have Node.js installed on your machine, you can run:

```which node```

If you get a response that indicates node is not a recognized command, you'll need to [install Node](https://nodejs.org/en/).

Once Node is installed, you can clone the source code, install dependencies and start a local web server with the following commands:

```
git clone https://github.com/YaleDHLab/gathering-a-building
cd gathering-a-building
npm install
npm start
```

If you then open a browser and navigate to localhost:8000, you should see the application. You can terminate this local server at any time by pressing CTRL+C in the terminal window in which the server is running.

## Previewing Changes

After making changes to your Wordpress database, you can preview the changes by pulling json from the Wordpress server to your local machine with the following command:

```
npm run build-content {{username}} {{password}}
```

Here `{{username}}` and `{{password}}` refer to the username and password strings you would enter to access the password-proctected [site url](http://gatheringabuilding.yale.edu).

If the fields in the Wordpress database are set according to the guide above, you should see confirmation messages that the json for each controller was written. If you received a validation error message, please revise the affected metadata fields and run the npm run build-content command again.

After writing the new json to your local machine, you can preview the changes by refreshing your browser. If you navigate to the routes/posts you changed in the Wordpress database, you should see the new values or content displayed.

## Deploying Updated Content

Once you are happy with the way the content looks, you can push your changes to the deployed server by running:

```
npm run deploy-content
```
