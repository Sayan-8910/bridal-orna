const IMAGE_BASE = 'https://bridal-orna.onrender.com';

export function getImageUrl(imagePath) {
  if (!imagePath) return '';

  if (/^https?:\/\//i.test(imagePath)) {
    try {
      const url = new URL(imagePath);
      if (url.hostname === 'localhost' || url.pathname.includes('/uploads/')) {
        return `${IMAGE_BASE}${url.pathname}${url.search}${url.hash}`;
      }
      return imagePath;
    } catch {
      return imagePath;
    }
  }

  const normalizedPath = imagePath.replace(/\\/g, '/').replace(/^\/+/, '');
  return `${IMAGE_BASE}/${normalizedPath}`;
}