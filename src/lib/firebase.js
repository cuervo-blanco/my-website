import { getApp, getApps, initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBygpDcQeB1uCLTiIAAtxvwM10Tzmkk0fE",
  authDomain: "my-website-26cef.firebaseapp.com",
  projectId: "my-website-26cef",
  storageBucket: "my-website-26cef.appspot.com",
  messagingSenderId: "1082529460512",
  appId: "1:1082529460512:web:25aefd99175dee1d59e745",
  measurementId: "G-SPLT8ZXMYL",
};

const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
let analyticsClientPromise;
let storageApiPromise;

export function getFirebaseApp() {
  return firebaseApp;
}

export async function logPageView(pagePath) {
  if (typeof window === "undefined") {
    return;
  }

  if (!analyticsClientPromise) {
    analyticsClientPromise = import("firebase/analytics")
      .then(async ({ getAnalytics, isSupported, logEvent }) => {
        const supported = await isSupported().catch(() => false);

        if (!supported) {
          return null;
        }

        return {
          analytics: getAnalytics(firebaseApp),
          logEvent,
        };
      })
      .catch(() => null);
  }

  const analyticsClient = await analyticsClientPromise;

  if (analyticsClient) {
    analyticsClient.logEvent(analyticsClient.analytics, "page_view", {
      page_path: pagePath,
    });
  }
}

async function getStorageApi() {
  if (!storageApiPromise) {
    storageApiPromise = import("firebase/storage");
  }

  return storageApiPromise;
}

export async function getStorageAssetUrl(storagePath) {
  const { getDownloadURL, getStorage, ref } = await getStorageApi();
  const storage = getStorage(firebaseApp);
  return getDownloadURL(ref(storage, storagePath));
}
