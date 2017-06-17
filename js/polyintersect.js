/*
 |--------------------------------------------
 | polyintersect.js
 |--------------------------------------------
 |
 | REQUIRES: Google Maps JavaScript API v3 (with geometry library)| 
 | https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry
 | 
 | SECTIONS: This files includes following -
 | 1. Polygon Object
 | 2. myLineSegment Object
 | 3. myIntersectionPoint Object
 | 4. myPointInside Object
 */

// Polygon Object

/*
 |-----------------------------------------
 | polygon - validate(index)
 |-----------------------------------------
 */
google.maps.Polygon.prototype.validate = function (index) {
    if (typeof index != 'number') {
        index = null;
    }

    // get the line segments of the polygon
    var polySegments = this.getLineSegments();

    // if an index is provided, only get the two segments sharing that index
    // if index is null then get all the line segments of this polygon
    var testSegments = this.getLineSegments(index);

    // loop through each test segment of the polygon
    for (var i = 0, end_i = testSegments.length; i < end_i; i++) {

        // loop through each segment of the polygon
        for (var j = 0, end_j = polySegments.length; j < end_j; j++) {

            // return false if there are any intersections
            if (testSegments[i].isIntersecting(polySegments[j])) {
                return false;
            }
        }
    }

    // if it makes it this far there are no intersections
    return true;
}

/*
 |-----------------------------------------
 | polygon - getLineSegments(e)
 |-----------------------------------------
 */
google.maps.Polygon.prototype.getLineSegments = function (e) {
    if (typeof e != 'number') {
        e = -1;
    }

    // declare an array to hold each line segment
    var lineSegments = [];

    // get the path of the polygon
    var path = this.getPath();

    // get the index of the last point in the path
    var lastPoint = path.getLength() - 1;

    // if provided index (e) is within the polygon's path, return only the two line segments sharing that index
    if (e >= 0 && e <= lastPoint) {

        // set start at point before provided index (e)
        var index = (e === 0) ? lastPoint : e - 1;

        for (var i = 0, end = 2; i < end; i++) {
            var startCoords = path.getAt(index);
            var startIndex = index;

            // connect the last point with the first point in the path to create the final line segment
            if (index === lastPoint) {
                var endCoords = path.getAt(0);
                var endIndex = 0;
            } else {
                var endCoords = path.getAt(index + 1);
                var endIndex = index + 1;
            }

            // if we are at the last point in the path, set index at 0
            if (index === lastPoint) {
                index = 0;
            } else {
                index++;
            }

            lineSegments.push(new myLineSegment(startCoords, endCoords, startIndex, endIndex));
        }

        return lineSegments;
    }

    // an appropriate index was not provided therefore grab all the line segments
    for (var i = 0, end = path.getLength(); i < end; i++) {
        var startCoords = path.getAt(i);
        var startIndex = i;

        // connect the last point with the first point in the path to create the final line segment
        if (i == lastPoint) {
            var endCoords = path.getAt(0);
            var endIndex = 0;
        } else {
            var endCoords = path.getAt(i + 1);
            var endIndex = i + 1;
        }

        // create new myLineSegment object and push it into array
        lineSegments.push(new myLineSegment(startCoords, endCoords, startIndex, endIndex));
    }

    return lineSegments;
}

/*
 |-----------------------------------------
 | polygon - countPointsInside(test)
 |-----------------------------------------
 */
google.maps.Polygon.prototype.countPointsInside = function (test) {
    // if test is not a google maps Polygon object return null
    if (!(test instanceof google.maps.Polygon)) {
        return null;
    }

    // declare a variable to store the count
    var numPointsInside = 0;

    // loop through the test path
    var testPath = test.getPath();
    for (var i = 0, end = testPath.getLength(); i < end; i++) {

        // check if point is inside this polygon
        if (google.maps.geometry.poly.containsLocation(testPath.getAt(i), this)) {
            numPointsInside++;
        }
    }

    return numPointsInside;
}

/*
 |-----------------------------------------
 | polygon - getPointsInside(test)
 |-----------------------------------------
 */
google.maps.Polygon.prototype.getPointsInside = function (test) {
    // if test is not a google maps Polygon object return null
    if (!(test instanceof google.maps.Polygon)) {
        return null;
    }

    // declare an array to hold the points inside this polygon
    var pointsInside = [];

    // loop through the test path
    var testPath = test.getPath();
    for (var i = 0, end = testPath.getLength(); i < end; i++) {

        // check if point is inside this polygon
        if (google.maps.geometry.poly.containsLocation(testPath.getAt(i), this)) {

            // create new myPointInside object and push it into array
            var coords = testPath.getAt(i);
            var pathIndex = i;

            pointsInside.push(new myPointInside(coords, pathIndex));
        }
    }
    return pointsInside;
}

/*
 |-----------------------------------------
 | polygon - containsPoint(test)
 |-----------------------------------------
 */
google.maps.Polygon.prototype.containsPoint = function (test) {
    // if test is not a google maps LatLng object return null
    if (!(test instanceof google.maps.LatLng)) {
        return null;
    }

    // check if point is inside this poly
    return google.maps.geometry.poly.containsLocation(test, this);
}

/*
 |-----------------------------------------
 | polygon - countIntersections(test)
 |-----------------------------------------
 */
google.maps.Polygon.prototype.countIntersections = function (test) {
    // if test is not a google maps Polygon object return null
    if (!(test instanceof google.maps.Polygon)) {
        return null;
    }

    // declare variables to count number of intersections
    var numIntersects = 0;

    // get the line segments of both polygons
    var polyLineSegments = this.getLineSegments();
    var testLineSegments = test.getLineSegments();

    // loop through each of this polygon's line segments
    for (var i = 0, end_i = polyLineSegments.length; i < end_i; i++) {

        // loop throuch each of the test polygon's line segments
        for (var j = 0, end_j = testLineSegments.length; j < end_j; j++) {

            // test each segment for an intersection point
            if (polyLineSegments[i].isIntersecting(testLineSegments[j])) {
                numIntersects++;
            }
        }
    }
    return numIntersects;
}

/*
 |-----------------------------------------
 | polygon - getIntersections(test)
 |-----------------------------------------
 */
google.maps.Polygon.prototype.getIntersections = function (test) {
    // if test is not a google maps Polygon object return null
    if (!(test instanceof google.maps.Polygon)) {
        return null;
    }

    // declare an array to hold the intersections points
    var intersectionPoints = [];

    // get the line segments of both polygons
    var polySegments = this.getLineSegments();
    var testSegments = test.getLineSegments();

    // loop through each polySegment
    for (var i = 0, end_i = polySegments.length; i < end_i; i++) {

        // loop through each testSegment
        for (var j = 0, end_j = testSegments.length; j < end_j; j++) {

            // check each segment for an intersection point
            if (polySegments[i].isIntersecting(testSegments[j])) {

                // get the intersection point for these lines
                var coords = polySegments[i].getIntersectionPoint(testSegments[j]);

                // get the two intersecting line segments
                var originalLine = polySegments[i];
                var selectionLine = testSegments[j];

                // create new myIntersectionPoint object and push it into array
                intersectionPoints.push(new myIntersectionPoint(coords, originalLine, selectionLine));
            }
        }
    }

    // exit function and return empty array
    if (intersectionPoints.length === 0) {
        return [];
    }

    // return the intersection points ordered by their distance from the start of original path
    return _orderIntersectionPoints(intersectionPoints);


    // private method to order the intersection points
    // first point will be the one closest to the start of the path
    function _orderIntersectionPoints(intersectionPoints) {

        // return an array sorted by distance from start of the original polygon's path
        return intersectionPoints.sort(_compare);

        function _compare(a, b) {
            // compare each intersection point's original line start index
            if (a.originalLine.startIndex > b.originalLine.startIndex) {
                return 1;
            }
            if (a.originalLine.startIndex < b.originalLine.startIndex) {
                return -1;
            }
            // if the intersection points are on the same line
            if (a.isOnSameLine(b)) {

                // determine the distance between the intersection points and the start of the original line
                var distanceA = google.maps.geometry.spherical.computeDistanceBetween(a.coordinates, a.originalLine.startCoords);
                var distanceB = google.maps.geometry.spherical.computeDistanceBetween(b.coordinates, a.originalLine.startCoords);

                if (distanceA > distanceB) {
                    return 1;
                }
                if (distanceA < distanceB) {
                    return -1;
                }
            }

            // if it makes it to this point they must be equal
            return 0;
        } // <-- _compare

    } // <-- _orderIntersectionPoints()

} // <-- getIntersections()


// myLineSegment Object

/*
 |------------------------------------------------------------------------------
 | myLineSegment - myLineSegment(startCoords, endCoords, startIndex, endIndex)
 |------------------------------------------------------------------------------
 |
 | startCoords/endCoords: should be a google.maps.LatLng object
 | startIndex/endIndex: should be a number representing its index in the polygon's path
 |
 */
function myLineSegment(startCoords, endCoords, startIndex, endIndex) {
    this.startCoords = startCoords;
    this.endCoords = endCoords;
    this.startIndex = startIndex;
    this.endIndex = endIndex;

    this.x1 = startCoords.lng();
    this.y1 = startCoords.lat();
    this.x2 = endCoords.lng();
    this.y2 = endCoords.lat();
}

/*
 |------------------------------------------------------------------------------
 | myLineSegment - isIntersecting(testSegment)
 |------------------------------------------------------------------------------
 |
 | method to test if lineSegment intersects with another
 |
 | returns: boolean
 |
 */
myLineSegment.prototype.isIntersecting = function (testSegment) {
    // checks if testSegment is a myLineSegment object
    if (!(testSegment instanceof myLineSegment)) {
        return false;
    }

    var p1 = this.startCoords;
    var p2 = this.endCoords;
    var p3 = testSegment.startCoords;
    var p4 = testSegment.endCoords;

    // if the line segments share a point return false
    if (p1 === p3 || p1 === p4 || p2 === p3 || p2 === p4) {
        return false;
    } else {
        return (_CCW(p1, p3, p4) != _CCW(p2, p3, p4)) && (_CCW(p1, p2, p3) != _CCW(p1, p2, p4));
    }

    // tests if points rotate counter clockwise
    // returns boolean
    function _CCW(p1, p2, p3) {
        a = p1.lng();
        b = p1.lat();
        c = p2.lng();
        d = p2.lat();
        e = p3.lng();
        f = p3.lat();

        return (f - b) * (c - a) > (d - b) * (e - a);
    }

} // <-- isIntersecting()

/*
 |------------------------------------------------------------------------------
 | myLineSegment - getSlope()
 |------------------------------------------------------------------------------
 |
 | method to get the slope of the line segment
 |
 | returns: a number or null
 |
 */
myLineSegment.prototype.getSlope = function () {
    if (this.x1 === this.x2) {
        return null; // slope is undefined on a vertical line
    } else if (this.y1 === this.y2) {
        return 0; // slope is zero on a horizontal line
    } else {
        return (this.y2 - this.y1) / (this.x2 - this.x1);
    }
}

/*
 |------------------------------------------------------------------------------
 | myLineSegment - getYIntercept()
 |------------------------------------------------------------------------------
 |
 | method to get the y-intercept of the line segment
 |
 | returns: a number or null
 |
 */
myLineSegment.prototype.getYIntercept = function () {
    if (this.getSlope() === null) {
        return null; // y-intercept is undefined on a vertical line
    } else if (this.getSlope() === 0) {
        return this.y1; // y-intercept is equal to y1 on a horiztonal line
    } else {
        return this.y1 - (this.getSlope() * this.x1);
    }
}

/*
 |------------------------------------------------------------------------------
 | myLineSegment - getUnderneathArea()
 |------------------------------------------------------------------------------
 |
 | method to get the area undearth the line segment
 |
 | returns: a number
 |
 */
myLineSegment.prototype.getUnderneathArea = function () {
    return (this.x2 - this.x1) * (this.y2 + this.y1);
}

/*
 |------------------------------------------------------------------------------
 | myLineSegment - getUnderneathArea()
 |------------------------------------------------------------------------------
 |
 | method to get the intersection point of this line segment and another
 |
 | success: returns google maps LatLng object
 | fail: returns null
 |
 */
myLineSegment.prototype.getIntersectionPoint = function (testSegment) {
    // returns null if testSegment is not a myLineSegment object
    if (!(testSegment instanceof myLineSegment)) {
        return null;
    }

    // returns null if the lines don't intersect
    if (!(this.isIntersecting(testSegment))) {
        return null;
    }

    // declare variables to hold intersection coords
    var x;
    var y;

    // get the slope and y-intercept for both lines
    var line1_slope = this.getSlope();
    var line1_yInt = this.getYIntercept();
    var line2_slope = testSegment.getSlope();
    var line2_yInt = testSegment.getYIntercept();

    // check if both lines have a y-intercept
    if (line1_yInt != null && line2_yInt != null) {

        // check if line1 is a horizontal line
        if (line1_slope === 0) {
            x = (line1_yInt - line2_yInt) / line2_slope;
            y = line1_yInt;
        }
        // check if line2 is a horizontal line
        else if (line2_slope === 0) {
            x = (line2_yInt - line1_yInt) / line1_slope;
            y = line2_yInt;
        } else {
            x = (line2_yInt - line1_yInt) / (line1_slope - line2_slope);
            y = (line1_slope * x) + line1_yInt;
        }
    } else {

        // check if line1 is a vertical line
        if (line1_slope === null) {

            // check if line2 is a horizontal line
            if (line2_slope === 0) {
                x = this.x1;
                y = testSegment.y1;
            } else {
                x = this.x1;
                y = (x * line2_slope) + line2_yInt;
            }
        }
        // check if line2 is a vertical line
        else if (line2_slope === null) {

            // check if line1 is a horizontal line
            if (line1_slope === 0) {
                x = testSegment.x1;
                y = this.y1;
            } else {
                x = testSegment.x1;
                y = (x * line1_slope) + line1_yInt;
            }
        }
    }

    // return intersection point as a google maps LatLng object
    return new google.maps.LatLng(y, x);
} // <-- getIntersectionPoint


// myIntersectionPoint Object

/*
 |---------------------------------------------------------------------------------
 | myIntersectionPoint(coords, originalLine, selectionLine)
 |---------------------------------------------------------------------------------
 |
 | coords: should be the value of intersectionPoint() function
 | originalLine/selectionLine: should be a myLineSegment object
 |
 */
function myIntersectionPoint(coords, originalLine, selectionLine) {
    this.coordinates = coords;
    this.originalLine = originalLine;
    this.selectionLine = selectionLine;
}

/*
 |---------------------------------------------------------------------------------
 | myIntersectionPoint - isOnSameLine(test)
 |---------------------------------------------------------------------------------
 |
 | method to test if intersection point is on the same line as another
 |
 */
myIntersectionPoint.prototype.isOnSameLine = function (test) {
    // return false if test is not a myIntersectionPoint object
    if (!(test instanceof myIntersectionPoint)) {
        return false;
    }

    return (this.originalLine.startIndex === test.originalLine.startIndex) && (this.originalLine.endIndex === test.originalLine.endIndex)
}

// myIntersectionPoint Object

/*
 |---------------------------------------------------------------------------------
 | myPointInside(coords, pathIndex)
 |---------------------------------------------------------------------------------
 |
 | coords: should be the value of pointsInside() function
 | pathIndex: should be a number
 |
 */
function myPointInside(coords, pathIndex) {
    this.coordinates = coords;
    this.pathIndex = pathIndex;
}