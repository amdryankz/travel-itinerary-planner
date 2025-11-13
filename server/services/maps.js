const { Client } = require('@googlemaps/google-maps-services-js');
const client = new Client({});

class MapsService {
  static async geocode(address) {
    try {
      const response = await client.geocode({
        params: {
          address,
          key: process.env.GOOGLE_MAPS_API_KEY
        }
      });

      if (response.data.results.length === 0) {
        throw new Error('Location not found');
      }

      const result = response.data.results[0];
      return {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        address: result.formatted_address
      };
    } catch (error) {
      console.error('Maps Service Error:', error);
      throw new Error('Failed to geocode address');
    }
  }

  static async getDistance(origin, destination) {
    try {
      const response = await client.distancematrix({
        params: {
          origins: [origin],
          destinations: [destination],
          key: process.env.GOOGLE_MAPS_API_KEY
        }
      });

      const element = response.data.rows[0].elements[0];

      if (element.status !== 'OK') {
        throw new Error('Could not calculate distance');
      }

      return {
        distance: element.distance.text,
        duration: element.duration.text,
        distanceValue: element.distance.value,
        durationValue: element.duration.value
      };
    } catch (error) {
      console.error('Maps Service Error:', error);
      throw new Error('Failed to get distance');
    }
  }

  static async searchPlaces(query, location) {
    try {
      const response = await client.textSearch({
        params: {
          query,
          location,
          key: process.env.GOOGLE_MAPS_API_KEY
        }
      });

      return response.data.results.map(place => ({
        name: place.name,
        address: place.formatted_address,
        location: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng
        },
        rating: place.rating,
        types: place.types
      }));
    } catch (error) {
      console.error('Maps Service Error:', error);
      throw new Error('Failed to search places');
    }
  }
}

module.exports = MapsService;