import { useState, useEffect } from 'react';

function usePlatform() {
  const [platform, setPlatform] = useState('desktop');

  useEffect(() => {
    const detectPlatform = () => {
      // Simple mobile detection
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      
      // You can add more complex detection logic here
      return isMobile ? 'mobile' : 'desktop';
    };

    setPlatform(detectPlatform());
  }, []);

  return platform;
}

export default usePlatform;