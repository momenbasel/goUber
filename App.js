import React, { useState } from 'react';
import { View, Text, TextInput, Button, Linking } from 'react-native';

export default function App() {
  const [link, setLink] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [formattedAddress, setFormattedAddress] = useState('');

  const parseLink = (url) => {
    if (url.includes('google.com/maps/place')) {
      const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (match && match.length === 3) {
        const lat = parseFloat(match[1]);
        const lng = parseFloat(match[2]);
        setLatitude(lat.toString());
        setLongitude(lng.toString());
        const addressStartIndex = url.indexOf('/place/') + 7;
        const addressEndIndex = url.indexOf('/', addressStartIndex);
        const address = url.substring(addressStartIndex, addressEndIndex).replace(/\+/g, ' ');
        setFormattedAddress(address);
      } else {
        alert('Invalid Google Maps URL');
      }
    } else if (url.includes('maps.app.goo.gl')) {
      const match = url.match(/(-?\d+)°(\d+)['’](\d+\.\d+)"([NS])\s*(-?\d+)°(\d+)['’](\d+\.\d+)"([EW])/);
      if (match && match.length === 9) {
        const lat = parseFloat(match[1]) + parseFloat(match[2])/60 + parseFloat(match[3])/3600;
        if (match[4] === 'S') {
          setLatitude((-lat).toString());
        } else {
          setLatitude(lat.toString());
        }

        const lng = parseFloat(match[5]) + parseFloat(match[6])/60 + parseFloat(match[7])/3600;
        if (match[8] === 'W') {
          setLongitude((-lng).toString());
        } else {
          setLongitude(lng.toString());
        }

        setFormattedAddress('');
      } else {
        alert('Invalid coordinates format');
      }
    } else {
      alert('Unsupported URL');
    }
  };

  const generateUberLink = () => {
    const uberUrl = `https://m.uber.com/ul/?client_id=<CLIENT_ID>&action=setPickup&pickup=my_location&dropoff[latitude]=${latitude}&dropoff[longitude]=${longitude}&dropoff[formatted_address]=${formattedAddress}`;
    Linking.openURL(uberUrl);
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TextInput
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, width: '80%', marginBottom: 10 }}
        placeholder="Enter Google Maps URL or coordinates"
        onChangeText={setLink}
        value={link}
      />
      <Button
        title="Parse"
        onPress={() => parseLink(link)}
      />
      <Text style={{ marginVertical: 10 }}>Latitude: {latitude}</Text>
      <Text style={{ marginVertical: 10 }}>Longitude: {longitude}</Text>
      {formattedAddress ? (
        <Text style={{ marginVertical: 10 }}>Formatted Address: {formattedAddress}</Text>
      ) : null}
      {latitude && longitude ? (
        <Button
          title="Open on Uber"
          onPress={generateUberLink}
        />
      ) : null}
    </View>
  );
}
