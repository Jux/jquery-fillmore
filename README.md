# jQuery Fillmore

Fillmore is a jQuery plugin that allows you to add a dynamically-resized background image to any page, or any given element.
The image will stretch to fit the page / element, and will automatically resize as the window size changes.

This was originally a fork of the jquery Backstretch plugin, which only allowed for stretching an image as the background 
of the page body, but then was rewritten to allow stretching a background image over any desired element as well. Hence the name,
"Fillmore"; it fills more elements :)  

The method parameters are different from backstretch however, taking a single 'settings' object (hash) as the first parameter for 
specifying everything, instead of the 3 parameter method signature that backstretch uses. This was done so that method calls could be made
on the underlying Fillmore object by providing the first parameter as a string instead of an object, with arguments appended (much
like how jQuery UI does it). 

The original jquery Backstretch plugin is here btw: https://github.com/srobbin/jquery-backstretch.  Thanks, Scott Robbin.


## Demo

There are a couple of examples included with this package, or feel free to check it out live [on the project page itself](http://srobbin.com/jquery-plugins/jquery-fillmore/).


## Setup

Include the jQuery library and Fillmore plugin files in your webpage (preferably at the bottom of the page, before the closing BODY tag):

```html
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script type="text/javascript" src="jquery.fillmore.min.js"></script>
```

Note: The example above uses the Google hosted version of jQuery; there is also a jQuery source file included with this distribution, if you would like to host it yourself.


## Usage

General usage of adding an image:

```javascript
// To stretch an image over the document body
$.fillmore( Object options );

// The above is equivalent to:
$('body').fillmore( Object options );


// To stretch an image over any element(s) (jQuery wrapped set)
$('div.myEls').fillmore( Object options );
```

Calling methods on the underlying Fillmore object:

```javascript
$.fillmore( String methodName, [ Mixed methodArgs... ] );

// The above is equivalent to:
$('body').fillmore( String methodName, [ Mixed methodArgs... ] );


// And on any jQuery wrapped set
$('div.myEls').fillmore( String methodName, [ Mixed methodArgs... ] );
```

See the examples, below.


## Settings

### src

Required. The src of the image to load. (type=String)

### mode

(type=String, default='cover') Possible values:

* **cover** - essentially a shim for `background-size: cover`
* **frame** - acts like `background-size: contain` when the image is larger than the container, or like a normal `no-repeat center` background otherwise

### focusX

The percentage from the left edge of the photo to keep fixed within the element, relative to its position in the original photo.  Uses (or mimics) the CSS background-position percentage values - see [the spec](http://www.w3.org/TR/css3-background/#background-position) for more info.  Note this doesn't apply in `mode: 'frame'`. (type=Number, default=50)

### focusY

Focus percentage from top - see focusX for more info. (type=Number, default=50)

### speed

This is the speed at which the image will fade in, after downloading is complete. Integers are accepted, as well as standard jQuery speed strings (slow, normal, fast). (type=Integer, default=0)

### onImageLoad

A function to run when the new image has been loaded (but not yet faded in). (type=Function, default=undefined)

### onImageVisible / callback

A function to run when the new image has been loaded and faded in. Either option name can be used (onImageVisible or callback). (type=Function, default=undefined)

### noCss3

Set to true to make the plugin *not* use CSS3 background-size:cover, if available. This can be used if you find a situation where the background-size:cover is not working correctly, and you need to fall back to the regular image stretching implementation. (If you find one of these situations though, let me know by creating a github issue!) (type=Boolean, default=false)



## Methods

### getSrc

Retrieves the original src of the image used to Fillmore the element.

### getImageSize

Retrieves the size of the original image used. Returns an object with properties `width` and `height`, or returns null if the image is not yet loaded.

### getViewableImageArea

Returns an object (hashmap) of properties defining the viewable area of the stretched image. Returns the following properties:

* {Number} width: The number of pixels that represent the width of the viewable area.
* {Number} height: The number of pixels that represent the height of the viewable area.
* {Number} offsetLeft: The number of pixels from the left side of the image to the left side of the viewable area.
* {Number} offsetTop: The number of pixels from the top of the image to the top of the viewable area.
* {Number} stretchedWidth: The width that the background image has been stretched to be, to stretch over the container.
* {Number} stretchedHeight: The height that the background image has been stretched to be, to stretch over the container.

### imageIsLoaded

Returns true if the latest image requested has been loaded. This will return true as soon as the image has loaded, before the image is visible (i.e. has been faded in).

### imageIsVisible

Returns true if the image is both loaded, and has been faded in.

### resize

Recalculates the image size in the container. This method should be called if the container's size changes, to fix the position of the backstretched image (as Fillmore has no way of knowing if the container size has changed). However, this does not need to be called on window resize, as Fillmore does take care of that. This only needs to be called if you are dynamically modifying the container element's size.

### destroy

Removes Fillmore from the given element(s), and returns the element(s) to their original state.



## Examples

```javascript
// Add a stretched background image to the page (body)
$.fillmore( { src: "/path/to/image.jpg", speed: 150 } );
```

Want to change the background image after Fillmore has been loaded? No problem, just call it again!

```javascript
$.fillmore( { src: "/path/to/image.jpg", speed: 150 } );

// Perhaps you'd like to change the image on a button click
$(".button").click(function() {
  $.fillmore( { src: "/path/to/next_image.jpg" } );
});
```

You may also stretch a background image over any element(s) as well.

```javascript
$('div').fillmore( { src: "/path/to/image.jpg", speed: 150 } );

// And then changing them at a later time...
$(".button").click(function() {
  $('div').fillmore( { src: "/path/to/next_image.jpg" } );
});
```

Removing the image at a later time:

```javascript
$('div').fillmore( { src: "/path/to/image.jpg", speed: 150 } );

// Removing the Fillmore'd image, by calling the destroy() method
$(".button").click(function() {
  $('div').fillmore( "destroy" );
});
```

## Changelog

### Version 1.4.1

* The 'speed' setting only affects the call to fillmore() that it is provided with, not subsequent calls which may just change
  other settings such as 'focusX' and 'focusY'.
* Upgrade Modernizr to 2.6.2.

### Version 1.4

* Added getViewableImageArea() method.

### Version 1.3

* Reorganized CSS3 and ImageStretch subclasses to a more well-factored state.
* Implemented getImageSize() method, to retrieve the original image size (can only be called after the image has loaded, however).
* Implemented onImageLoad / onImageVisible callbacks.
* Implemented imageIsLoaded() and imageIsVisible() methods.

### Version 1.2

* <a href="https://github.com/afeld" target="_blank">afeld</a> implemented CSS3 background-size:cover implementation, for supporting browsers.


### Version 1.1

* Implemented getSrc() method, to retrieve the src used for the Fillmore'd image at a later time.
* Implemented the resize() method, which can be called after the container has been resized, and the backstretched image's position needs to be updated.


### Version 1.0

* Rewrote original jquery Backstretch plugin (https://github.com/srobbin/jquery-backstretch) to be able to stretch a background image over any element; not just the page body.
* Changed method signature from 3 param backstretch signature to 1 param 'settings' signature.
* Added a 'destroy' method to remove the Fillmore instance, and reset the container element back to its original state. 


## Support

Please file a ticket on our Github issue tracker.


## Contributing

Fork it! :)
