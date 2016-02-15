# phpgeo-demo
Demo of using geo data in PHP web applications

## Goals
* Demonstrate basic data storage and retrieval methods using Geo specific data
* Orient the user to SQL (MySQL) and NoSQL (MongoDB) containers
* Introduction to [GeoJSON](http://geojson.org/)
* Discussion of methods for comparing data
* Introduction to database queries and indexing for Geometric/Geographic data

## API
Base URL : `{domain} /api/v1/`

### Authentication
PUT/POST/DELETE requests are required to include a header `X-Authorization` with it's value set to an API token matching a token found in the `api_keys` table.

### Routes

#### locations
##### GET /locations
###### Params: null
###### Response
Collection of all of the locations stored in the `locations` MySQL table.

##### POST /locations
###### Params
* geometry - (array)
* name (string)
* description (text)

##### PUT /locations/{id}
###### Params
* geometry - (array)
* name (string)
* description (text)


##### DELETE /locations/{id}

##### GET /contains
###### Params:
* lat - (float) latitude of a point to test against locations
* lng - (float) longitude of a point to test against locations

###### Response
Collection of all of the locations that contain the point described in the request parameters.

##### GET /intersects
###### Params:
* geometry - (array) Array of points that define a closed polygon

###### Response
Collection of all locations intersected by the geometry described in the request parameter.

##### GET /within
###### Params:
* geometry - (array) Array of points that define a closed polygon

###### Response
Collection of all locations wholly bounded by the geometry described in the request parameter.
