import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import vn from "./vn.json";
import us from "./us.json";
import raw_us from "./raw_us.json";

const resources = {
  raw_us: {
    translation: raw_us,
  },
  vn: {
    translation: vn,
  },
  us: {
    translation: us,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "us",
  fallbackLng: "raw_us",
  debug: true,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
