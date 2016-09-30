[![Stories in Ready](https://badge.waffle.io/YaleDHLab/gathering-a-building.png?label=ready&title=Ready)](https://waffle.io/YaleDHLab/gathering-a-building)
[![Dependency Status](https://david-dm.org/YaleDHLab/gathering-a-building.svg)](https://david-dm.org/YaleDHLab/gathering-a-building)
[![devDependency Status](https://david-dm.org/YaleDHLab/gathering-a-building/dev-status.svg)](https://david-dm.org/YaleDHLab/gathering-a-building#info=devDependencies)

# Gathering a Building

This repository contains the source code for a web application that details aspects of Yale University's architecture. The application is built on an Angular 1 frontend that presents cartographic data from CartoDB server and multimedia assets from and a Wordpress API backend.

# Admin Users

Admin users can update data displayed on the site by visiting the site's [admin interface](http://ec2-54-71-20-87.us-west-2.compute.amazonaws.com/wp-login.php). After logging in, users can establish the data to be displayed on the site by creating and editing posts using the following guide:

The following elements of a post determine the title and paragraph content of a text block on the deployed site:

## Required Metadata fields

#### title  

The title of each post is defined by the traditional Wordpress post title field.   

#### paragraphs 
  
The text content for each post is defined by the traditional Wordpress text content field.  

#### controller  

<i>Custom Field</i>

```
Accepted values:  
 * historical-geography
 * architecture-and-urbanism
 * material-journeys
 * people-and-places
```

The controller field within a post controls where that post will be displayed in the site navigation: i.e. whether the post will appear under www.mydomain.com/routes/historical-geography or www.mydomain.com/routes/people-and-places.  

#### order 

<i>Custom Field</i>

```
Accepted values:  
 * 0 through the number of posts for the given controller -1
```

The order field within a post controls where the post will be presented within a route, i.e. the order in which sections will appear within the text column as user's scroll through the content for a given route.

Given all of the posts that share a controller, one can set the order in which they will appear by giving the post that should appear first an order value of 0, the next post that should appear an order value of 1, and so on. Please note that duplicate order values are not accepted.

#### sectionType

<i>Custom Field</i>

```
Accepted values:  
 * table-of-contents
 * text
```

The sectionType field within a post indicates whether the given post represents the table of contents section for a particular controller or a text-based section for that controller. 

`table-of-contents`  
If a post's sectionType value is set to table-of-contents, the text column for that section will be represented as a series of links followed by a one-paragraph introduction to the section ([example display](./build/documentation_images/material-journeys.png)). To create a table of contents, one should identify all of the posts for a given controller, then create one paragraph in the main Wordpress text box for each section within the controller that follows the table of contents ([example admin content](./build/documentation_images/material-journeys-admin-text.png)). 

`text`  
If a post's sectionType value is set to text, the text column for that section will be represented as a series of traditional paragraphs ([example display](./build/documentation_images/concrete.png)). To create a text post, one should simply enter paragraphs into the traditional Wordpress text field [example admin content](./build/documentation_images/concrete-admin-text.png)).

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
If a post's template value is set to one-div-container, its background will be a full page background image ([example display](./build/documentation_images/concrete.png)). The background image is determined by the Featured Image for the given post ([example display](./build/documentation_images/concrete-featured-image.png)).

`three-div-container`  
If a post's template value is set to three-div-container, its background will consist of three elements represented on the right hand side of the screen ([example display](./build/documentation_images/people-and-places.png)). The content within these elements is set by the following custom fields: `topImage`, `bottomImage`, `topCaption`, `bottomCaption`. Both the topImage and bottomImage fields are full paths to image files, while the topCaption and bottomCaption fields are plaintext caption fields. ([example admin content](./build/documentation_images/people-and-places-admin.png))

`four-div-container`  
If a post's template value is set to four-div-container, its background will consist of four full height images that link to sections within the given controller ([example display](./build/documentation_images/material-journeys.png)). The background images for this background template are determined by the `introImage` field within posts for this controller. For instance, the example display linked earlier in this paragraph shows a page with four background images: concrete, stone, brick, and glass. The first of these images (concrete) is defined by the introImage value within the post that has an order value of 1 (as this is the first post to appear after the table of contents). Within the post with an order value of 1, the image to be represented in the four-div-container is specified in the introImage custom field ([example admin content](./build/documentation_images/concrete-admin-custom-fields.png))


## Development Instance

A development instance of this repository is deployed at the following address: http://gathering-a-building-deploy.s3-website-us-east-1.amazonaws.com/#/

## Developing

```
npm install
npm start
```

## Deploying

```
npm run deploy
```