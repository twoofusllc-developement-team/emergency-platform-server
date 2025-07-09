import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {encryptTransform} from "redux-persist-transform-encrypt";
import { authReducer, setInitialized } from "../slices/authSlices";
import { personReducer } from "../slices/userSlice";
import { rateLimitReducer } from "../slices/ratelimiterSlice";

const encryptor = encryptTransform({
  secretKey: "testingfeat",
  onError: (error) => {
    console.error(error);
  },
});

const rootReducer = combineReducers({
  auth: authReducer,
  userdata: personReducer,
  rateLimit: rateLimitReducer,
});

const persistConfig = {
  key: "root",
  storage,
  version: 1,
  transforms: [encryptor],
};

const persistedReducer = persistReducer(
  persistConfig,
  rootReducer
);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/REGISTER",
        ],
        ignoredPaths: ["_persist"],
      },
    }),
});

export const persistor = persistStore(store, {}, () => {
  // This callback runs after rehydration is complete
  store.dispatch(setInitialized());
}); 