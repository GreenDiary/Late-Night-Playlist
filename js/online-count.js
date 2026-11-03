let firebaseConfig = {};
try {
  const localConfig = await import('./online-count-config.local.js');
  if (localConfig.firebaseConfig && typeof localConfig.firebaseConfig === 'object') {
    firebaseConfig = localConfig.firebaseConfig;
  }
} catch {
}

const counter = document.querySelector('#online-counter');
const countValue = document.querySelector('#online-count-value');
const requiredConfigValues = ['apiKey', 'authDomain', 'databaseURL', 'projectId', 'appId'];
const isConfigured = requiredConfigValues.every((key) => Boolean(firebaseConfig[key]?.trim()));

if (isConfigured) {
  counter.classList.remove('hidden');
  startOnlineCount().catch(showUnavailable);
}

async function startOnlineCount() {
  const sdkUrl = 'https://www.gstatic.com/firebasejs/13.1.0';
  const [appSdk, authSdk, databaseSdk] = await Promise.all([
    import(`${sdkUrl}/firebase-app.js`),
    import(`${sdkUrl}/firebase-auth.js`),
    import(`${sdkUrl}/firebase-database.js`)
  ]);

  const app = appSdk.initializeApp(firebaseConfig);
  const auth = authSdk.getAuth(app);
  const user = await waitForUser(auth, authSdk.onAuthStateChanged, authSdk.signInAnonymously);
  const database = databaseSdk.getDatabase(app, firebaseConfig.databaseURL);
  const presenceRef = databaseSdk.ref(database, 'presence');
  const connectedRef = databaseSdk.ref(database, '.info/connected');
  let isConnected = false;

  databaseSdk.onValue(presenceRef, (snapshot) => {
    if (!isConnected) return;
    let onlineUsers = 0;
    snapshot.forEach((userSnapshot) => {
      if (userSnapshot.hasChildren()) onlineUsers += 1;
    });
    countValue.textContent = String(onlineUsers);
  }, showUnavailable);

  databaseSdk.onValue(connectedRef, (snapshot) => {
    isConnected = snapshot.val() === true;
    counter.classList.toggle('is-online', isConnected);
    if (!isConnected) {
      countValue.textContent = '—';
      return;
    }
    addConnection(databaseSdk, database, user.uid).catch(showUnavailable);
  }, showUnavailable);
}

function waitForUser(auth, onAuthStateChanged, signInAnonymously) {
  if (auth.currentUser) return Promise.resolve(auth.currentUser);
  return new Promise((resolve, reject) => {
    let unsubscribe = () => {};
    const fail = (error) => {
      unsubscribe();
      reject(error);
    };
    unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();
      try {
        const signedInUser = user || (await signInAnonymously(auth)).user;
        resolve(signedInUser);
      } catch (error) {
        reject(error);
      }
    }, fail);
  });
}

async function addConnection(databaseSdk, database, userId) {
  const connectionRef = databaseSdk.push(databaseSdk.ref(database, `presence/${userId}`));
  await databaseSdk.onDisconnect(connectionRef).remove();
  await databaseSdk.set(connectionRef, true);
}

function showUnavailable() {
  counter.classList.remove('is-online');
  countValue.textContent = '—';
}
