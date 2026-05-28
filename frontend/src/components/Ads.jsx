import React, { useEffect, useRef } from 'react';

const DIRECT_AD_URL = 'https://www.effectivecpmnetwork.com/rnbgkjez?key=b16ec21e9c71117e1d52af047ea39ced';
const NATIVE_AD_KEY = 'e14a1380cad034d298844b738d241e49';
const BANNER_AD_KEY = '85685fa1052a28c9e7444bd10dc54ab8';

export const NativeAd = () => {
  useEffect(() => {
    const scriptId = `ad-native-${NATIVE_AD_KEY}`;

    if (document.getElementById(scriptId)) return;

    const script = document.createElement('script');
    script.id = scriptId;
    script.async = true;
    script.dataset.cfasync = 'false';
    script.src = `https://pl29570370.effectivecpmnetwork.com/${NATIVE_AD_KEY}/invoke.js`;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="ad-slot ad-slot-native" aria-label="Advertisement">
      <div id={`container-${NATIVE_AD_KEY}`} />
    </div>
  );
};

export const BannerAd = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || container.dataset.loaded === 'true') return;

    container.dataset.loaded = 'true';
    window.atOptions = {
      key: BANNER_AD_KEY,
      format: 'iframe',
      height: 50,
      width: 320,
      params: {},
    };

    const script = document.createElement('script');
    script.src = `https://www.highperformanceformat.com/${BANNER_AD_KEY}/invoke.js`;
    container.appendChild(script);
  }, []);

  return <div ref={containerRef} className="ad-slot ad-slot-banner" aria-label="Advertisement" />;
};

export const DirectAdLink = () => (
  <a className="ad-direct-link" href={DIRECT_AD_URL} target="_blank" rel="noreferrer">
    Advertisement
  </a>
);

const Ads = ({ placement = 'top' }) => (
  <div className="ads-stack">
    <BannerAd />
    {placement === 'bottom' && (
      <>
        <NativeAd />
        <DirectAdLink />
      </>
    )}
  </div>
);

export default Ads;
