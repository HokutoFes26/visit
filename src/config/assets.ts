// Local paths resolve inside the app directory, including GitHub Pages /visit/.
export function assetUrl(path: string) {
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
}
