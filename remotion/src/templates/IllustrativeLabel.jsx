import React from 'react';
import { BRAND, FONTS } from '../brand';

export default function IllustrativeLabel({ language = 'en' }) {
  return <div style={{
    position: 'absolute', bottom: 60, left: 60, right: 60, zIndex: 50,
    color: BRAND.goldLight, fontFamily: FONTS.heading, fontSize: 24,
  }}>{language === 'fr' ? 'Démo illustrative — aucune donnée en direct' : 'Illustrative demo — not live data'}</div>;
}
