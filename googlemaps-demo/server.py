"""Demonstration of Google Maps."""

from jinja2 import StrictUndefined
from flask import Flask, render_template, jsonify, send_from_directory
from flask_debugtoolbar import DebugToolbarExtension

from model import connect_to_db, db, Bear

app = Flask(__name__)
# app.config["SECRET_KEY"] = "ursusmaritimus"
# app.jinja_env.undefined = StrictUndefined


# If you put the API key in secrets.sh, you will ALSO need 
# to restrict the IP address. (When/if you deploy, you will 
# need to change the IP address from your public IP address 
# to the IP address of your deployment server.) 

# Really, it should not be necessary to put the API key in 
# secrets.sh at all -- you should just be able to restrict 
# the IP and then put the key directly into your HTML. Because 
# of the IP restriction it will still be secure. However, it 
# seems that Google may complain because it thinks your key 
# has been exposed.

# TLDR: If you use the Google Maps API, you need to restrict 
# the IP address. You shouldn't need to put the key in 
# secrets.sh, but you may need to do that as well in order 
# to prevent Google from needlessly freaking out and disabling 
# your API key.

#---------------------------------------------------------------------#

@app.route("/")
def index():
    """Show homepage."""

    return render_template("index.html")

@app.route("/map/basic")
def view_basic_map():
    """Demo of basic map-related code.

    - Programmatically adding markers, info windows, and event handlers to a
      Google Map
    - Showing polylines, directions, etc.
    - Geolocation with HTML5 navigator.geolocate API
    """

    return render_template("map-basic.html")


@app.route("/map/more")
def view_more_demos():
    """Demo of basic map-related code.

    - Programmatically adding markers, info windows, and event handlers to a
      Google Map
    - Showing polylines, directions, etc.
    - Geolocation with HTML5 navigator.geolocate API
    """

    return render_template("map-more.html")


@app.route("/map/bears")
def view_bear_map():
    """Show map of bears."""

    return render_template("map-bears.html")


@app.route("/api/bears")
def bear_info():
    """JSON information about bears."""

    # List comprehension that is then Jsonified
    bears = [
        {
            "id": bear.marker_id,
            "bearId": bear.bear_id,
            "gender": bear.gender,
            "birthYear": bear.birth_year,
            "capYear": bear.cap_year,
            "capLat": bear.cap_lat,
            "capLong": bear.cap_long,
            "collared": bear.collared.lower()
        }
        for bear in Bear.query.limit(50)
    ]

    return jsonify(bears)


#- BORING DEMO CONFIG STUFF ------------------------------------------#
#---------------------------------------------------------------------#

@app.route("/map/static/<path:resource>")
def get_resource(resource):
    return send_from_directory("static", resource)


if __name__ == "__main__":
    app.debug = True
    connect_to_db(app)
    # DebugToolbarExtension(app)

    app.run(host="0.0.0.0")
