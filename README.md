# Validate self-intersecting polygons in Google Maps
A Google Maps JavaScript API v3 library to validate self-intersecting an exisiting polygon.

## Installation
#### Step 1
Add the Google Maps JavaScript API version 3 with the geometry library.
```html
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry"></script>
```
#### Step 2
Add the polyintersect.js file.
```html
<script type="text/javascript" src="js/polyintersect.min.js"></script>
```
  
## Usage
#### Step 1
Initialize a map with a polygon.

#### Step 2
Call **.validate()** method on your polygon to validate self-intersecting whole polygon or can call **.validate(index)** to validate polygon vertex.