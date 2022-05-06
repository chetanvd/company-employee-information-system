const admin = require('firebase-admin');
require('dotenv').config();

let _firestore;

function once(fn, context) {
  var result;

  return function () {
    if (fn) {
      result = fn.apply(context || this, arguments);
      fn = null;
    }
    return result;
  };
}

let initAdmin = once(function () {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: process.env.DATABASE_URL,
  });
});

function initFirestore() {
  if (_firestore) {
    console.warn('Trying to init Firestore again!');
    return _firestore;
  }

  initAdmin();
  _firestore = admin.firestore();
  //console.log('DB Initialized : ', _firestore);
  console.log('DB Initialized : ');
}

function getFirestore() {
  if (!_firestore) {
    console.log('Firestore not initialized');
    initFirestore();
  }
  return _firestore;
}

module.exports = {
  getFirestore,
  admin,
};
