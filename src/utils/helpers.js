export const imagePath = (filename) => {
  if (!filename) return "";
  const clean = String(filename).replace(/^\/+/, "");
  return `${import.meta.env.BASE_URL}images/${clean}`;
};

export default imagePath;