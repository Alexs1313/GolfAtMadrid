import React, { useRef, useState, useEffect } from 'react';
import {
  Linking,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import WebView from 'react-native-webview';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Clipboard from '@react-native-clipboard/clipboard';

const CRYPTO_SCHEMES = [
  'bitcoin', 'ethereum', 'litecoin', 'dogecoin', 'bitcoincash',
  'tether', 'bch', 'dash', 'ripple', 'monero', 'zcash', 'stellar', 'usdcoin',
];

const INJECTED_JS = `
  (function() {
    var s = ${JSON.stringify(CRYPTO_SCHEMES)};
    document.addEventListener('click', function(e) {
      var el = e.target;
      while (el && el.tagName !== 'A') el = el.parentElement;
      if (!el || !el.href) return;
      var scheme = el.href.split(':')[0].toLowerCase();
      if (s.indexOf(scheme) !== -1) {
        e.preventDefault();
        e.stopPropagation();
        var addr = el.href.split(':').slice(1).join(':').split('?')[0] || '';
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'crypto', address: addr }));
      }
    }, true);
  })();
  true;
`;

export default function AppManagerChild({ navigation, route }) {
  const url = route.params.data;
  const userAgent = route.params.userAgent;
  const webViewRef = useRef(null);
  const [isTwoClick, setTwoClick] = useState(false);

  const isWebUrl = /^https?:\/\//i.test(url || '');

  useEffect(() => {
    if (!url) return;

    const scheme = url.split(':')[0].toLowerCase();

    if (CRYPTO_SCHEMES.includes(scheme)) {
      const address = url.split(':')[1]?.split('?')[0] || '';
      if (address && Clipboard?.setString) Clipboard.setString(address);
      navigation.goBack();
      return;
    }

    if (!isWebUrl) {
      Linking.openURL(url).catch(() => {});
      navigation.goBack();
    }
  }, [url]);

  const handleBackPress = () => {
    if (isTwoClick) {
      navigation.goBack();
      return;
    }
    setTwoClick(true);
    webViewRef.current?.goBack();
    setTimeout(() => setTwoClick(false), 1000);
  };

  const handleShouldStartLoad = event => {
    const scheme = (event.url.split(':')[0] || '').toLowerCase();

    if (CRYPTO_SCHEMES.includes(scheme)) {
      const address = event.url.split(':')[1]?.split('?')[0] || '';
      if (address && Clipboard?.setString) Clipboard.setString(address);
      return false;
    }

    if (
      event.url.includes('wa.me/') ||
      event.url.includes('api.whatsapp.com/') ||
      event.url.includes('whatsapp.com/')
    ) {
      let waUrl = event.url;
      const match = event.url.match(/wa\.me\/(\d+)/);
      if (match) waUrl = `whatsapp://send?phone=${match[1]}`;
      Linking.openURL(waUrl).catch(() => Linking.openURL(event.url));
      return false;
    }

    const internalSchemes = ['about', 'javascript', 'data', 'blob'];
    if (!/^https?$/.test(scheme) && !internalSchemes.includes(scheme)) {
      Linking.openURL(event.url).catch(() => {});
      return false;
    }

    return true;
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
        <StatusBar barStyle="light-content" />
        {isWebUrl && (
          <WebView
            ref={webViewRef}
            source={{ uri: url }}
            userAgent={userAgent}
            style={{ flex: 1 }}
            originWhitelist={['*', 'http://*', 'https://*', 'intent://*']}
            onShouldStartLoadWithRequest={handleShouldStartLoad}
            injectedJavaScript={INJECTED_JS}
            onMessage={e => {
              try {
                const msg = JSON.parse(e.nativeEvent.data);
                if (msg.type === 'crypto' && msg.address && Clipboard?.setString) {
                  Clipboard.setString(msg.address);
                }
              } catch {}
            }}
            textZoom={100}
            allowsBackForwardNavigationGestures
            domStorageEnabled
            javaScriptEnabled
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            setSupportMultipleWindows={false}
            javaScriptCanOpenWindowsAutomatically
            showsVerticalScrollIndicator={false}
            onError={({ nativeEvent }) => {
              if (nativeEvent.code === -1101 || nativeEvent.code === -1002) {
                navigation.goBack();
              }
            }}
          />
        )}
      </SafeAreaView>

      <TouchableOpacity
        style={{ width: 30, height: 30, position: 'absolute', bottom: 0, left: 25, alignItems: 'center', justifyContent: 'center' }}
        onPress={handleBackPress}>
        <Ionicons name="arrow-back" size={21} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={{ width: 30, height: 30, position: 'absolute', bottom: 5, right: 25, alignItems: 'center', justifyContent: 'center', padding: 5 }}
        onPress={() => webViewRef.current?.reload()}>
        <Ionicons name="reload" size={21} color="white" />
      </TouchableOpacity>
    </View>
  );
}
